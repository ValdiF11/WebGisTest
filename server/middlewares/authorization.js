const { SpatialData } = require("../models");

const UserAuthorization = async (req, res, next) => {
  try {
    let spatialData = await SpatialData.findByPk(req.params.id);
    if (!spatialData) {
      throw { name: "Not Found" };
    }
    if (spatialData.UserId !== req.user.id) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const AdminAuthorization = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw { name: "Forbidden" };
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { UserAuthorization, AdminAuthorization };
