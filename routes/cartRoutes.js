const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");

router.use(protect);

// @route   GET /cart
// @desc    Get logged-in user's cart
// @access  Private
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price description",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty !" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching cart", error: error.message });
  }
});

// @route   POST /cart
// @desc    Add a product to the cart
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate productId presence
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    // Check if product exists in DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check stock availability
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: `Only ${product.stock} items in stock` });
    }

    // Find or create cart for this user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Return populated cart
    await cart.populate("items.product", "name price description");
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error adding to cart", error: error.message });
  }
});

module.exports = router;
