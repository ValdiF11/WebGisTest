const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const { UserAuthorization, AdminAuthorization } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/user", authentication, UserController.getUser);
router.get("/users", authentication, AdminAuthorization, UserController.getAllUser);

module.exports = router;
