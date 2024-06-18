const { SpatialData, sequelize } = require("../models");
const { exec } = require("child_process");
const Dropbox = require("dropbox").Dropbox;
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch: fetch,
});

class SpatialDataController {
  static async uploadSHP(req, res, next) {
    try {
      const filePath = req.file.path;
      const tableName = "spatial_data";
      const fileName = req.file.filename;
      const fileContent = await fs.readFile(filePath);
      await dbx.filesUpload({ path: `/${fileName}`, contents: fileContent });

      exec(`shp2pgsql -s 4326 -I -W "latin1" ${fileName} ${tableName} | psql -d spatial_db -U postgres`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          throw { name: "Internal Server Error" };
        }
        if (stderr) {
          console.error(stderr);
          throw { name: "Internal Server Error" };
        }
        console.log(stdout);
        res.status(201).json({ message: "Spatial data successfully uploaded" });
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getAllSpatialData(req, res, next) {
    try {
      const spatialData = await SpatialData.findAll();
      res.status(200).json(spatialData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getSpatialData(req, res, next) {
    try {
      const { name } = req.params;
      const result = await sequelize.query(`SELECT ST_AsGeoJSON(geom) FROM spatial_data WHERE name = '${name}'`, {
        replacements: { name },
        type: sequelize.QueryTypes.SELECT,
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getRadius(req, res, next) {
    try {
      const { lat, lon, radius } = req.query;
      const result = await sequelize.query(
        `SELECT ST_AsGeoJSON(geom) FROM spatial_data WHERE ST_DWithin(geom, ST_MakePoint(${lon}, ${lat})::geography, ${radius})`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getRoute(req, res, next) {
    try {
      const { startlan, startlon, endlan, endlon } = req.query;
      const result = await sequelize.query(
        `SELECT ST_AsGeoJSON(ST_Union(geom)
        FROM pgr_dijkstra(
            'SELECT id, source, target, cost FROM spatial_data',
            (SELECT source FROM spatial_data ORDER BY geom <-> ST_SetSRID(ST_MakePoint(${startlon}, ${startlan}), 4326) LIMIT 1),
            (SELECT target FROM spatial_data ORDER BY geom <-> ST_SetSRID(ST_MakePoint(${endlon}, ${endlan}), 4326) LIMIT 1),
            directed := false
        ) AS dijkstra `,
        {
          replacements: { startlan, startlon, endlan, endlon },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = SpatialDataController;
