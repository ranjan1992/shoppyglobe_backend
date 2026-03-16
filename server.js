const express = require("express");

const app = express();

app.use(express.json());

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
