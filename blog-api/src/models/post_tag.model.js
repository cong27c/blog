"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    static associate(models) {
      // Đây là bảng trung gian cho quan hệ nhiều-nhiều giữa Post và Tag
      PostTag.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      PostTag.belongsTo(models.Tag, {
        foreignKey: "tag_id",
        as: "tag",
      });
    }
  }

  PostTag.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      tag_id: {
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
      modelName: "PostTag",
      tableName: "post_tag",
      underscored: true,
      timestamps: false, // migration có created_at, updated_at rồi
    }
  );

  return PostTag;
};
