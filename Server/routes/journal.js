const express = require("express");
const router = express.Router();
const { Journal } = require("../db/db");
const { authenticateJWT, secretKey } = require("../middleware/auth");

const app = express();

app.use(express.json());

router.post("/journals", authenticateJWT, async (req, res) => {
  console.log(req.user);
  try {
    const { title, content } = req.body;
    const user = {
      email: req.user.email,
      _id: req.user.userID,
    };
    const journal = {
      title,
      content,
    };
    const newJournal = new Journal({ user, journal });
    await newJournal.save();
    res.status(200).json({
      message: "Journal uploaded successfully!",
      userId: req.user._id,
    });
  } catch (error) {
    res.status(500).json({ error: `Error creating a new journal entry` });
  }
});

module.exports = router;
