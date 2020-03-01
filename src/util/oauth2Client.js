const { google } = require("googleapis");
const { CLIENT_ID, CLIENT_SECRET } = require("../const");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://wdn84.csb.app/auth"
);
exports.oauth2Client = oauth2Client;

const oauth2 = tokens => {
  oauth2Client.setCredentials(tokens);
  return google.oauth2({
    auth: oauth2Client,
    version: "v2"
  });
};
exports.oauth2 = oauth2;

const sheets = tokens => {
  oauth2Client.setCredentials(tokens);
  return google.sheets({
    auth: oauth2Client,
    version: "v4"
  });
};
exports.sheets = sheets;
