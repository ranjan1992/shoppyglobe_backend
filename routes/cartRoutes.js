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

module.exports = router;
