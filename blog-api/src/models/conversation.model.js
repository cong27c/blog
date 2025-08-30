"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.UserConversation, {
        foreignKey: "conversation_id",
        as: "members",
      });

      Conversation.hasMany(models.UserConversation, {
        foreignKey: "conversation_id",
        as: "member1", // user hiện tại
      });

      Conversation.hasMany(models.UserConversation, {
        foreignKey: "conversation_id",
        as: "member2", // recipient
      });

      Conversation.hasOne(models.Message, {
        foreignKey: "conversation_id",
        as: "lastMessage",
      });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true, // migration của bạn không để allowNull:false => mặc định cho phép null
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_message_at: {
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
      modelName: "Conversation",
      tableName: "conversation",
      underscored: true, // để Sequelize tự động map created_at, updated_at đúng
      timestamps: false, // vì bạn đã có created_at, updated_at trong migration rồi
    }
  );

  return Conversation;
};
