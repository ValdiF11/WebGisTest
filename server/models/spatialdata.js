"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpatialData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpatialData.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  SpatialData.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        allowNull: false,
        validate: {
          isEmpty: {
            args: false,
            msg: "User ID cannot be empty",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmpty: {
            args: false,
            msg: "Name cannot be empty",
          },
        },
      },
      geom: {
        type: DataTypes.GEOMETRY,
        allowNull: false,
        validate: {
          isEmpty: {
            args: false,
            msg: "Geometry data cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SpatialData",
    }
  );
  return SpatialData;
};
