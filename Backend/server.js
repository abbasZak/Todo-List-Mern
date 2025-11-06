require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5001;
const userRoute = require("./routes/userRoutes");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", userRoute);



// Connect to MongoDB first, then start server
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log("🚀 Server running on port", port);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
