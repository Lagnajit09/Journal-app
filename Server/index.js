const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Connected",
  });
});

mongoose.connect(
  //Your mongoDB connection URL
);

app.listen(3000, () => {
  console.log("Server started at post 3000");
});
