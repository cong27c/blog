"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserNotification extends Model {
    static associate(models) {
      // 1 UserNotification thuộc về 1 User
      UserNotification.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // 1 UserNotification thuộc về 1 Notification
      UserNotification.belongsTo(models.Notification, {
        foreignKey: "notification_id",
        as: "notification",
      });
    }
  }

  UserNotification.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      notification_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
      modelName: "UserNotification",
      tableName: "user_notification",
      underscored: true,
      timestamps: false, // đã có created_at, updated_at trong migration
    }
  );

  return UserNotification;
};
