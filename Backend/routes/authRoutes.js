const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");

// Registration route
router.post("/register", userController.createUser);

// Login route
router.post("/login", userController.loginUser);

module.exports = router;
