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

router.get("/journals", authenticateJWT, async (req, res) => {
  const userJournals = await Journal.find(
    { "user._id": req.user.userID },
    { user: 0, _id: 0, "journal._id": 0, __v: 0 }
  );
  console.log(req.user.userID);
  res.json({
    journals: userJournals,
  });
});

router.get("/journals/:id", authenticateJWT, async (req, res) => {
  const journal = await Journal.findOne(
    { _id: req.params.id },
    { user: 0, _id: 0, "journal._id": 0, __v: 0 }
  );
  res.json({
    journal,
  });
});

router.put("/journals/:journalId", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedJournal = await Journal.findByIdAndUpdate(
      { _id: req.params.journalId },
      {
        $set: {
          journal: {
            title,
            content,
          },
        },
      }
    );
    res.json({
      updatedJournal,
    });
  } catch (error) {
    return res.status(400).send("Unable to update the journal");
  }
});

router.delete("/journals/:journalId", async (req, res) => {
  try {
    const deletedJournal = await Journal.findByIdAndDelete({
      _id: req.params.journalId,
    });
    res.json({
      deletedJournal,
    });
  } catch (error) {
    return res.status(400).send("Unable to delete the journal");
  }
});

// router.use((err, req, res, next) => {
//   console.log(err);

//   res.status(400).json({
//     status: "error",
//   });
// });

module.exports = router;
