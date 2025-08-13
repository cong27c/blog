"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserConversation extends Model {
    static associate(models) {
      // Bảng trung gian kết nối User và Conversation nhiều-nhiều
      UserConversation.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      UserConversation.belongsTo(models.Conversation, {
        foreignKey: "conversation_id",
        as: "conversation",
      });
    }
  }

  UserConversation.init(
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
      conversation_id: {
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
      modelName: "UserConversation",
      tableName: "user_conversation",
      underscored: true,
      timestamps: false, // đã có created_at, updated_at trong migration rồi
    }
  );

  return UserConversation;
};
