"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Bookmarks (many-to-many)
      User.belongsToMany(models.Post, {
        through: models.Bookmark,
        foreignKey: "user_id",
        otherKey: "post_id",
        as: "bookmarkedPosts",
      });

      // One user has many comments
      User.hasMany(models.Comment, {
        foreignKey: "user_id",
        as: "comments",
      });

      User.hasMany(models.Like, {
        foreignKey: "user_id",
        as: "likes",
      });
      User.hasMany(models.Follow, {
        foreignKey: "followed_id",
        as: "followers", // những người follow user này
      });

      User.hasMany(models.Follow, {
        foreignKey: "following_id",
        as: "following", // user này đang follow ai
      });

      // One user has many posts
      User.hasMany(models.Post, {
        foreignKey: "user_id",
        as: "posts",
      });

      // One user has many bookmarks
      User.hasMany(models.Bookmark, {
        foreignKey: "user_id",
        as: "bookmarks",
      });
    }
  }

  User.init(
    {
      first_name: { type: DataTypes.STRING(50) },
      last_name: { type: DataTypes.STRING(50) },
      email: { type: DataTypes.STRING(255), unique: true, allowNull: true },
      password: { type: DataTypes.STRING(100), allowNull: true },
      two_factor_enable: { type: DataTypes.BOOLEAN, defaultValue: false },
      two_factor_secret: { type: DataTypes.STRING(50), allowNull: true },
      user_name: { type: DataTypes.STRING(50), unique: true, allowNull: true },
      avatar: { type: DataTypes.STRING(255), allowNull: true },
      cover_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      privacy: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
          profileVisibility: "public",
          showEmail: false,
          showFollowersCount: false,
          showFollowingCount: false,
          allowDirectMessages: false,
          showOnlineStatus: false,
        },
      },
      title: { type: DataTypes.STRING(100) },
      about: { type: DataTypes.TEXT },
      followers_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      following_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      like_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      address: { type: DataTypes.TEXT, allowNull: true },
      website_url: { type: DataTypes.STRING(255), allowNull: true },
      twitter_url: { type: DataTypes.STRING(255), allowNull: true },
      github_url: { type: DataTypes.STRING(255), allowNull: true },
      linkedin_url: { type: DataTypes.STRING(255), allowNull: true },
      verified_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
    }
  );

  return User;
};
