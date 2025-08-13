"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Post belongs to User
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "author",
      });

      Post.belongsToMany(models.Topic, {
        through: "posttopics",
        foreignKey: "post_id",
        otherKey: "topic_id",
        as: "topics",
      });

      Post.hasMany(models.Like, {
        foreignKey: "likable_id",
        constraints: false,
        scope: {
          likable_type: "Post",
        },
        as: "likes",
      });

      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        as: "comments",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Post.belongsToMany(models.User, {
        through: models.Bookmark,
        foreignKey: "post_id",
        otherKey: "user_id",
        as: "bookmarkedByUsers", // tên alias mới để tránh trùng
      });

      // KẾT NỐI CŨ GIỮ NGUYÊN
      Post.hasMany(models.Bookmark, {
        foreignKey: "post_id",
      });
    }
  }

  Post.init(
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      thumbnail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cover: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "draft",
      },
      visibility: {
        type: DataTypes.STRING(50),
        defaultValue: "public",
      },
      views_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      published_at: {
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
      modelName: "Post",
      tableName: "posts",
      underscored: true, // created_at → createdAt tự map
      timestamps: false, // Vì bạn đã khai báo thủ công `created_at`, `updated_at`
    }
  );

  return Post;
};
