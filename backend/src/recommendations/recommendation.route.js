const express = require("express");
const router = express.Router();
const {
  getProductRecommendations,
  getUserRecommendations,
} = require("./recommendation");

// Gợi ý hybrid cho 1 sản phẩm cụ thể
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 8;

    const recommendations = await getProductRecommendations(id, limit);

    res.status(200).json({
      success: true,
      recommendations,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error getting product recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy gợi ý sản phẩm",
    });
  }
});

// Gợi ý cá nhân hóa cho user
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit) || 8;

    const recommendations = await getUserRecommendations(email, limit);

    res.status(200).json({
      success: true,
      recommendations,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Error getting user recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy gợi ý cho người dùng",
    });
  }
});

module.exports = router;
