"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // 1 message thuộc về 1 user
      Message.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      // 1 message thuộc về 1 conversation
      Message.belongsTo(models.Conversation, {
        foreignKey: "conversation_id",
        as: "conversation",
      });

      Message.belongsTo(models.User, { foreignKey: "user_id", as: "sender" });
      Message.belongsTo(models.Agent, { foreignKey: "agent_id" });
    }
  }

  Message.init(
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
      agent_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      conversation_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      metadata: { type: DataTypes.JSON, allowNull: true },

      type: {
        type: DataTypes.STRING(50),
        defaultValue: "text",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deleted_at: {
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
      modelName: "Message",
      tableName: "messages",
      underscored: true,
      timestamps: false, // migration đã có created_at, updated_at rồi
      paranoid: false, // vì bạn dùng deleted_at thủ công rồi, không dùng paranoid mặc định
    }
  );

  return Message;
};
