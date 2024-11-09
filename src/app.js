require("dotenv").config();
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const { connect } = require("./database/mongodb");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan("combined"));

app.use("/api", require("./routes"));

app.all("*", (req, res) => {
  res.status(404).json({ error: "Not support." });
});

app.use(require("./middlewares/error-handler.middleware"));

connect().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

module.exports = app;
