// import mongoose, { Schema } from "mongoose";
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

var tokenSchema = new Schema({
  title: String,
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  id_token: String,
  expiry_date: Number
});

const userSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      require: true
    },
    firstVisit: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      unique: true,
      require: true
    },
    picture: String,
    hd: String,
    spreadsheetId: String,
    tokens: {
      type: tokenSchema,
      select: false
    }
  },
  { collection: "Users" }
);

exports.User = mongoose.model("User", userSchema);
