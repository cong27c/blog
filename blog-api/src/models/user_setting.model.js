"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    static associate(models) {
      // Mỗi user có 1 setting (1-1)
      UserSetting.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  UserSetting.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      data: {
        type: DataTypes.JSON,
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
      two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      two_factor_secret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      default_post_visibility: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "public",
      },
      allow_comments: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      require_comment_approval: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_view_counts: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      email_new_comments: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      email_new_likes: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      email_new_followers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      email_weekly_digest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      push_notifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      profile_visibility: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "public",
      },
      allow_direct_messages: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "everyone",
      },
      search_engine_indexing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      show_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserSetting",
      tableName: "user_settings",
      underscored: true,
      timestamps: false, // migration đã có created_at, updated_at rồi
    }
  );

  return UserSetting;
};
