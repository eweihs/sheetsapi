const express = require("express");
const { SCOPE } = require("../const");
const { oauth2Client, oauth2 } = require("../util/oauth2Client");
const { User } = require("../schemas/userSchema");

const authRouter = express.Router();

/**
 * Create Url for login
 */
authRouter.get("/", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPE
    });
    res.json({ error: false, url });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

/**
 * Verify code from login redirect and create access tokens
 */
authRouter.post("/tokens", async (req, res) => {
  try {
    const {
      body: { code }
    } = req;
    const { tokens } = await oauth2Client.getToken(code);

    const { data } = await oauth2(tokens).userinfo.v2.me.get({});

    let user = await User.findOne({ email: data.email });

    if (!user) {
      user = new User({
        ...data,
        tokens
      });
      await user.save();
    } else {
      // update tokens tokens;
      user.tokens = tokens;
      user.firstVisit = false;
    }
    await user.save();
    res.json({
      error: false,
      user: {
        email: user.email,
        accessToken: tokens.access_token,
        spreadsheetId: user.spreadsheetId
      }
    });
  } catch (error) {
    res.json({ error: true, message: error.message, body: req.body });
  }
});

/**
 * Create Url for login
 */
authRouter.get("/user", async (req, res) => {
  try {
    const {
      headers: { authorization }
    } = req;
    const accessToken = (authorization || "").split(" ")[1];
    const { tokens } = await User.findOne(
      { "tokens.access_token": accessToken },
      "tokens"
    );

    const { data } = await oauth2(tokens).userinfo.v2.me.get({});

    res.json({ error: false, data });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

/**
 * List all users
 */
authRouter.get("/listusers", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.json({ error: false, message: "Yeah, it works", users });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

exports.authRouter = authRouter;
