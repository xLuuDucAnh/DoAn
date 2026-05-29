const express = require("express");
const mongoose = require("mongoose");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const { products: sampleProducts } = require("../data/sampleData");
const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

const publicSampleProducts = sampleProducts.map((product) => ({
  ...product,
  _id: product._id.toString(),
  author: {
    _id: product.author.toString(),
    email: "admin@example.com",
    username: "admin",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const normalizeSearchText = (value = "") => {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const getFilteredSampleProducts = ({ category, color, minPrice, maxPrice, search }) => {
  const normalizedSearch = normalizeSearchText(search).trim();

  return publicSampleProducts.filter((product) => {
    const searchableText = normalizeSearchText(`${product.name} ${product.description} ${product.category}`);
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesCategory = !category || category === "all" || product.category === category;
    const matchesColor = !color || color === "all" || product.color === color;
    const matchesMin = !minPrice || product.price >= Number(minPrice);
    const matchesMax = !maxPrice || product.price <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesColor && matchesMin && matchesMax;
  });
};

// post a product
router.post("/create-product", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Bulk creation
      const savedProducts = await Products.insertMany(req.body);
      return res.status(201).json(savedProducts);
    }

    // Single product creation (existing logic)
    const newProduct = new Products({
      ...req.body,
    });

    const savedProduct = await newProduct.save();

    // Calculate the average rating (only for single product if needed, 
    // though usually new products have 0 reviews)
    const reviews = await Reviews.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save();
    }

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product(s):", error);
    res.status(500).json({ 
      message: "Failed to create product", 
      error: error.message // Return specific error message for debugging
    });
  }
});

// Get all posts (public route)
router.get("/", async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, page = 1, limit = 10, search } = req.query;

    if (!isDbConnected()) {
      const filteredProducts = getFilteredSampleProducts({ category, color, minPrice, maxPrice, search });
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;
      const products = filteredProducts.slice(skip, skip + limitNumber);
      const totalProducts = filteredProducts.length;
      const totalPages = Math.ceil(totalProducts / limitNumber);

      return res.status(200).send({ products, totalPages, totalProducts });
    }

    const filter = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (color && color !== "all") {
      filter.color = color;
    }

    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email")
      .sort({ createdAt: -1 });

    res.status(200).send({ products, totalPages, totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});


// Get single post (public route)
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!isDbConnected()) {
      const product = publicSampleProducts.find((item) => item._id === productId);

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      return res.status(200).send({ product, reviews: [] });
    }

    // console.log(postId)

    const product = await Products.findById(productId).populate(
      "author",
      "email username"
    );
    // console.log(post)

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const reviews = await Reviews.find({ productId }).populate(
      "userId",
      "username email"
    );

    res.status(200).send({ product, reviews });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send({ message: "Failed to fetch post" });
  }
});

// update a post (protected route)
router.patch("/update-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    // const { title, content, category } = req.body;
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res
      .status(200)
      .send({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
});

// delete a post with the related comment
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find and delete the products collection
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Delete associated comments
    await Reviews.deleteMany({ productId: productId });

    res
      .status(200)
      .send({
        message: "Product and associated comments deleted successfully",
      });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ message: "Failed to delete post" });
  }
});

// related products
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is defined
    if (!id) {
      return res.status(400).send({ message: "Product ID is required" });
    }

    // Find the product by ID
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Create a regex pattern for partial matching of the product name
    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter((word) => word.length > 1)
        .join("|"),
      "i"
    );

    // Find related products that match either the name or category, excluding the current product
    const relatedProducts = await Products.find({
      _id: { $ne: id }, // Exclude the current product
      $or: [
        { name: { $regex: titleRegex } }, // Match similar names
        { category: product.category }, // Match the same category
      ],
    });

    res.status(200).send(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});

module.exports = router;
