const Products = require("../products/products.model");
const Order = require("../orders/orders.model");
const Reviews = require("../reviews/reviews.model");

/**
 * Content-Based Score: so sánh thuộc tính giữa 2 sản phẩm
 * - Cùng category: +0.5
 * - Cùng color: +0.2
 * - Chênh lệch giá < 30%: +0.3
 */
function contentBasedScore(productA, productB) {
  let score = 0;

  if (productA.category === productB.category) {
    score += 0.5;
  }

  if (productA.color && productB.color && productA.color === productB.color) {
    score += 0.2;
  }

  if (productA.price && productB.price) {
    const priceDiff = Math.abs(productA.price - productB.price);
    const avgPrice = (productA.price + productB.price) / 2;
    if (avgPrice > 0 && priceDiff / avgPrice < 0.3) {
      score += 0.3;
    }
  }

  return score; // max = 1.0
}

/**
 * Collaborative Score dựa trên co-purchase từ orders
 * Trả về map { productId: score }
 */
async function collaborativeScores(targetProductId, allProductIds) {
  // Tìm tất cả đơn hàng chứa sản phẩm mục tiêu
  const ordersWithTarget = await Order.find({
    "products.productId": targetProductId.toString(),
  });

  if (ordersWithTarget.length === 0) {
    return {};
  }

  // Đếm số lần mỗi sản phẩm khác xuất hiện cùng trong đơn hàng
  const coPurchaseCount = {};
  for (const order of ordersWithTarget) {
    for (const item of order.products) {
      const pid = item.productId.toString();
      if (pid !== targetProductId.toString()) {
        coPurchaseCount[pid] = (coPurchaseCount[pid] || 0) + 1;
      }
    }
  }

  // Tìm các reviews có rating cao (≥4) cho sản phẩm mục tiêu
  const highRatedReviews = await Reviews.find({
    productId: targetProductId,
    rating: { $gte: 4 },
  });

  const userIdsWhoLikedTarget = highRatedReviews.map((r) =>
    r.userId.toString()
  );

  // Tìm sản phẩm khác mà cùng group users cũng đánh giá cao
  let reviewSimilarity = {};
  if (userIdsWhoLikedTarget.length > 0) {
    const otherHighRatedReviews = await Reviews.find({
      userId: { $in: userIdsWhoLikedTarget },
      productId: { $ne: targetProductId },
      rating: { $gte: 4 },
    });

    for (const review of otherHighRatedReviews) {
      const pid = review.productId.toString();
      reviewSimilarity[pid] = (reviewSimilarity[pid] || 0) + 1;
    }

    // Chuẩn hóa
    const maxReviewCount =
      Math.max(...Object.values(reviewSimilarity), 1);
    for (const pid in reviewSimilarity) {
      reviewSimilarity[pid] = reviewSimilarity[pid] / maxReviewCount;
    }
  }

  // Tính collaborative score tổng hợp
  const scores = {};
  const maxCoPurchase = Math.max(...Object.values(coPurchaseCount), 1);

  const allIds = new Set([
    ...Object.keys(coPurchaseCount),
    ...Object.keys(reviewSimilarity),
  ]);

  for (const pid of allIds) {
    const coScore = (coPurchaseCount[pid] || 0) / maxCoPurchase;
    const revScore = reviewSimilarity[pid] || 0;
    scores[pid] = coScore * 0.6 + revScore * 0.4; // trọng số trong collaborative
  }

  return scores;
}

/**
 * Hybrid recommendation cho 1 sản phẩm
 * Trả về danh sách sản phẩm được gợi ý, sắp xếp theo score giảm dần
 */
async function getProductRecommendations(productId, limit = 8) {
  const targetProduct = await Products.findById(productId);
  if (!targetProduct) return [];

  // Lấy tất cả sản phẩm khác
  const allProducts = await Products.find({ _id: { $ne: productId } });
  if (allProducts.length === 0) return [];

  // Tính collaborative scores
  const collabScores = await collaborativeScores(
    productId,
    allProducts.map((p) => p._id)
  );

  // Tính hybrid score cho từng sản phẩm
  const scored = allProducts.map((product) => {
    const cbScore = contentBasedScore(targetProduct, product);
    const cfScore = collabScores[product._id.toString()] || 0;
    const hybridScore = 0.4 * cbScore + 0.6 * cfScore;

    return {
      product,
      hybridScore,
      contentScore: cbScore,
      collaborativeScore: cfScore,
    };
  });

  // Sắp xếp theo hybrid score giảm dần
  scored.sort((a, b) => b.hybridScore - a.hybridScore);

  return scored.slice(0, limit).map((s) => ({
    ...s.product.toObject(),
    _recommendationScore: {
      hybrid: Math.round(s.hybridScore * 100) / 100,
      content: Math.round(s.contentScore * 100) / 100,
      collaborative: Math.round(s.collaborativeScore * 100) / 100,
    },
  }));
}

/**
 * Gợi ý cá nhân hóa cho user dựa trên lịch sử mua hàng
 */
async function getUserRecommendations(email, limit = 8) {
  // Lấy đơn hàng của user
  const userOrders = await Order.find({ email });

  if (!userOrders || userOrders.length === 0) {
    // Fallback: trả sản phẩm rating cao + bán chạy
    const topProducts = await Products.find()
      .sort({ rating: -1 })
      .limit(limit);
    return topProducts.map((p) => ({
      ...p.toObject(),
      _recommendationScore: { hybrid: 0, content: 0, collaborative: 0 },
      _fallback: true,
    }));
  }

  // Lấy danh sách productId đã mua (unique)
  const purchasedProductIds = new Set();
  for (const order of userOrders) {
    for (const item of order.products) {
      purchasedProductIds.add(item.productId.toString());
    }
  }

  // Với mỗi product đã mua, lấy recommendations
  const scoreMap = {}; // { productId: { totalScore, product } }

  for (const purchasedId of purchasedProductIds) {
    const recs = await getProductRecommendations(purchasedId, 20);
    for (const rec of recs) {
      const pid = rec._id.toString();
      // Bỏ qua sản phẩm đã mua
      if (purchasedProductIds.has(pid)) continue;

      if (!scoreMap[pid]) {
        scoreMap[pid] = { totalScore: 0, count: 0, product: rec };
      }
      scoreMap[pid].totalScore += rec._recommendationScore.hybrid;
      scoreMap[pid].count += 1;
    }
  }

  // Tính điểm trung bình và sắp xếp
  const results = Object.values(scoreMap)
    .map((entry) => ({
      ...entry.product,
      _recommendationScore: {
        ...entry.product._recommendationScore,
        hybrid: Math.round((entry.totalScore / entry.count) * 100) / 100,
      },
    }))
    .sort((a, b) => b._recommendationScore.hybrid - a._recommendationScore.hybrid)
    .slice(0, limit);

  return results;
}

module.exports = {
  getProductRecommendations,
  getUserRecommendations,
};
