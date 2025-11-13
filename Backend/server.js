require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5001;

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ new one
const taskRoutes = require("./routes/taskRoutes");

// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use("/api/auth", authRoutes);   // for register & login
app.use("/api/users", userRoutes);  // for /profile and other user routes
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => console.log("🚀 Server running on port", port));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
