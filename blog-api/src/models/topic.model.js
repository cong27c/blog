"use strict";

module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      posts_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: "Topics",
      underscored: true, // để Sequelize map created_at thay vì createdAt
      timestamps: false, // đã tự xử lý created_at/updated_at bằng tay
    }
  );

  Topic.associate = function (models) {
    Topic.belongsToMany(models.Post, {
      through: "posttopics",
      foreignKey: "topic_id",
      otherKey: "post_id",
      as: "posts",
    });
  };

  return Topic;
};
