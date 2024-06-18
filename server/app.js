if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const router = require("./Routers/router");
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

module.exports = app;
