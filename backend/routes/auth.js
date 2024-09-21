const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require('dotenv').config();

const JWT_SECRET =process.env.JWT_SECRET;

// ROUTE-1: Create a user using POST "/api/auth/createuser", doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false
    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //Hashing
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //Check whether the user already exists
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success =true
      res.json({success, authToken });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ROUTE-2: Auhtenticate a user using POST "/api/auth/login", doesn't require authentication
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({success, error: "Invalid credentials" });
      }
      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        return res.status(400).json({success, error: "Invalid credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success, authToken });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ROUTE-3: Getting logged-in user details using POST "/api/auth/getuser",  requires authentication
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
