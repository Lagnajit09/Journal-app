const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const journalUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

const journalDataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const journalSchema = new mongoose.Schema({
  user: journalUserSchema,
  journal: journalDataSchema,
});

const User = mongoose.model("User", userSchema);
const Journal = mongoose.model("Journal", journalSchema);

module.exports = { User, Journal };
