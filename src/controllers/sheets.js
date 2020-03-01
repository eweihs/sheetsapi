const express = require("express");
const { sheets } = require("../util/oauth2Client");
const { User } = require("../schemas/userSchema");

const sheetsRouter = express.Router();
const RANGE = "A:B";
sheetsRouter.get("/create", async (req, res) => {
  try {
    const {
      headers: { authorization }
    } = req;
    const accessToken = (authorization || "").split(" ")[1];
    const { tokens } = await User.findOne(
      { "tokens.access_token": accessToken },
      "tokens"
    );

    const { data } = await sheets(tokens).spreadsheets.create({
      resource: {
        properties: {
          title: "Sheets Logbook"
        }
      }
    });
    const { spreadsheetId } = data;

    await User.findOneAndUpdate(
      { "tokens.access_token": accessToken },
      { spreadsheetId }
    );

    res.json({ error: false, spreadsheetId });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

sheetsRouter.get("/read", async (req, res) => {
  try {
    const {
      headers: { authorization }
    } = req;
    const accessToken = (authorization || "").split(" ")[1];
    const { tokens, spreadsheetId } = await User.findOne(
      { "tokens.access_token": accessToken },
      "tokens spreadsheetId"
    );

    const { data } = await sheets(tokens).spreadsheets.values.get({
      spreadsheetId,
      range: RANGE
    });

    res.json({ error: false, data });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

sheetsRouter.post("/append", async (req, res) => {
  try {
    const {
      headers: { authorization },
      body: { entry }
    } = req;
    const accessToken = (authorization || "").split(" ")[1];
    const { tokens, spreadsheetId } = await User.findOne(
      { "tokens.access_token": accessToken },
      "tokens spreadsheetId"
    );

    const resource = {
      majorDimension: "ROWS",
      values: [entry]
    };
    const options = {
      spreadsheetId,
      range: RANGE,
      valueInputOption: "USER_ENTERED",
      resource
    };
    const response = await sheets(tokens).spreadsheets.values.append(options);

    res.json({ error: false, response });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

exports.sheetsRouter = sheetsRouter;
