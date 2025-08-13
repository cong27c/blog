"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // 1 người follow nhiều người (following_id là user follow)
      Follow.belongsTo(models.User, {
        foreignKey: "following_id",
        as: "following",
      });

      // 1 người được nhiều người follow (followed_id là user được follow)
      Follow.belongsTo(models.User, {
        foreignKey: "followed_id",
        as: "followed",
      });
    }
  }

  Follow.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      following_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      followed_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follows",
      underscored: true,
      timestamps: false, // đã có created_at, updated_at trong migration rồi
    }
  );

  return Follow;
};
