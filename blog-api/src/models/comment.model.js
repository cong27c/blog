"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // belongs to User as author
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "author",
      });

      // belongs to Post
      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });

      // self reference: parent / replies
      Comment.belongsTo(models.Comment, {
        foreignKey: "parent_id",
        as: "parent",
        constraints: false,
      });
      Comment.hasMany(models.Comment, {
        foreignKey: "parent_id",
        as: "replies",
        constraints: false,
      });

      // likes (polymorphic) — ensure Like model uses same field names
      Comment.hasMany(models.Like, {
        foreignKey: "likable_id", // or "likable_id" — **must match Like model & queries**
        constraints: false,
        scope: { like_able_type: "comment" },
        as: "likes",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      post_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      parent_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
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
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return Comment;
};
