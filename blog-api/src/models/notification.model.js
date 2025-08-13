"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Notification thuộc về User
      Notification.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // Notification có thể thuộc về Post (nullable)
      Notification.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // Nếu bạn dùng polymorphic association, có thể cần thêm xử lý riêng cho notifiable_type và notifiable_id
      // Sequelize không hỗ trợ polymorphic mặc định, cần custom query hoặc package mở rộng
    }
  }

  Notification.init(
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
      post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      notifiable_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      notifiable_id: {
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
      modelName: "Notification",
      tableName: "notifications",
      underscored: true,
      timestamps: false,
    }
  );

  return Notification;
};
