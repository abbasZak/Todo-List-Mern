const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // ✅ Check if all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // ❌ Bug fixed here — you used `existingUser._id` instead of `newUser._id`
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ Respond success (avoid returning password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    });

  } catch (error) {
    console.error("❌ Error in createUser:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if fields are provided first
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
  { id: existingUser._id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: "1d" }
);


    // ✅ Respond with success and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name, // optional
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createUser, loginUser };
