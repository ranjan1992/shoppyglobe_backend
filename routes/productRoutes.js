const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @route   GET/products
// @desc    Fetch all the products from MongoDB
// @access  Public

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(200).json({ message: "No products found !" });
    }

    res.status(200).json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching products",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product Id format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching product", error: error.message });
  }
});

module.exports = router;
