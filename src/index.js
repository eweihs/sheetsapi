const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;
const { MONGO_DETAILS } = require("./const");
const { authRouter } = require("./controllers/auth");
const { sheetsRouter } = require("./controllers/sheets");

const url = `mongodb://${MONGO_DETAILS.user}:${MONGO_DETAILS.passport}@${
  MONGO_DETAILS.host
}:${MONGO_DETAILS.port}/${MONGO_DETAILS.database}`;

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, apikey, authorization"
  ); // If needed

  res.setHeader("Access-Control-Allow-Credentials", true); // If needed
  // req.answer = ({ msg = null, ...rest }) => res.json({ error: false, msg, answer: { ...rest } });
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
console.log(`connect to ${url}...`);
mongoose.set("useCreateIndex", true);
mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("yeah, connected to mongo server");
  app.use("/auth", authRouter);
  app.use("/sheets", sheetsRouter);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
