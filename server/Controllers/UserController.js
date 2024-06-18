const { comparePassword } = require("../helpers/bcrypt");
const createToken = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async register(req, res, next) {
    try {
      const { email, username, name, password } = req.body;
      await User.create({ email, username, name, password });
      let data = await User.findOne({ where: { email }, attributes: { exclude: ["password"] } });
      res.status(201).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, username, password } = req.body;
      if (!email && !username) {
        throw { name: "Invalid Input" };
      }
      if (!password) {
        throw { name: "Invalid Input" };
      }
      let user;
      if (email) {
        user = await User.findOne({ where: { email } });
      } else if (username) {
        user = await User.findOne({ where: { username } });
      }
      if (!user) {
        throw { name: "Invalid User" };
      }
      let compare = comparePassword(password, user.password);
      if (!compare) {
        throw { name: "Invalid User" };
      }
      let token = createToken({ id: user.id });
      res.status(200).json({ access_token: token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getUser(req, res, next) {
    try {
      let data = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllUser(req, res, next) {
    try {
      let data = await User.findAll({ attributes: { exclude: ["password"] }, where: { role: "user" } });
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = UserController;
