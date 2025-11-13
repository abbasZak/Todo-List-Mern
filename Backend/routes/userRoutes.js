const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Protected profile route
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
