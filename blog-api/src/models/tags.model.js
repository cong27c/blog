"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Tag có thể liên kết nhiều Post qua bảng trung gian post_tag
      Tag.belongsToMany(models.Post, {
        through: models.PostTag,
        foreignKey: "tag_id",
        otherKey: "post_id",
        as: "posts",
      });
    }
  }

  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
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
      modelName: "Tag",
      tableName: "tags",
      underscored: true,
      timestamps: false, // migration đã có created_at, updated_at
    }
  );

  return Tag;
};
