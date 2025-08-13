"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Queue.init(
    {
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "pending",
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      max_retries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      retries_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Queue",
      tableName: "queues",
      underscored: true,
      timestamps: true,
    }
  );

  return Queue;
};
