const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

router.use("/users", require("./user"));
router.use("/spatial-data", require("./map"));

module.exports = router;
