// models/like.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      likable_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      likable_id: {
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
      tableName: "likes",
      underscored: true,
      timestamps: false,
    }
  );

  Like.associate = function (models) {
    Like.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Like.belongsTo(models.Post, {
      foreignKey: "likable_id",
      constraints: false,
      scope: {
        likable_type: "Post",
      },
      as: "post",
    });
  };

  return Like;
};
