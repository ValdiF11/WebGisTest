const express = require("express");
const SpatialDataController = require("../Controllers/SpatialDataController");
const { AdminAuthorization } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/addShp", authentication, AdminAuthorization, SpatialDataController.uploadSHP);
router.get("/radius", authentication, SpatialDataController.getRadius);
router.get("/route", authentication, SpatialDataController.getRoute);
router.get("/shp/:name", authentication, SpatialDataController.getSpatialData);

module.exports = router;
