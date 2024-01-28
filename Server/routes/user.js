const express = require("express");
const router = express.Router();
const { z, ZodError } = require("zod");
const bcrypt = require("bcrypt");
const User = require("../db/db");
const jwt = require("jsonwebtoken");
const { authenticateJWT, secretKey } = require("../middleware/auth");

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number",
      }
    ),
});

router.post("/signup", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(403).json({
      message: "User already exists!",
    });
  }
  try {
    const userData = signupSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      email: userData.email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Signup successful!",
      data: userData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed!",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong...",
      });
    }
  }
});

router.post("/signin", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found! Please sign up.",
    });
  }

  const token = jwt.sign({ email }, secretKey, (err, token) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      user: {
        email: req.body.email,
        password: req.body.password,
      },
      token: token,
    });
  });
});

module.exports = router;
