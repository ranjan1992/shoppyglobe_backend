const express = require("express");
const connectDB = require("./config/db");

const dotenv = require("dotenv");
dotenv.config();

connectDB();
const app = express();

app.use(express.json());

// Routes
app.use("/register", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "🛒 ShoppyGlobe API is running!",
    endpoints: {
      auth: ["POST /register", "POST /login"],
      products: ["GET /products", "GET /products/:id"],
      cart: [
        "GET /cart (protected)",
        "POST /cart (protected)",
        "PUT /cart/:productId (protected)",
        "DELETE /cart/:productId (protected)",
      ],
    },
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
