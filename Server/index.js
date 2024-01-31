const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mongodb_URL = process.env.MONGODB_URL;

const userRouter = require("./routes/user");
const journalRouter = require("./routes/journal");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/user", journalRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Connected",
  });
});

mongoose.connect(mongodb_URL);

app.listen(3000, () => {
  console.log("Server started at post 3000");
});
