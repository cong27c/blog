// models/AgentTool.js
module.exports = (sequelize, DataTypes) => {
  const AgentTool = sequelize.define(
    "AgentTool",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      agent_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      toolType: {
        type: DataTypes.STRING,
        defaultValue: "customFunction",
        field: "toolType",
      },
      config: { type: DataTypes.JSON, allowNull: true }, // JSON cho MariaDB
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
      tableName: "agenttools",
      underscored: true,
      timestamps: false,
    }
  );

  AgentTool.associate = (models) => {
    AgentTool.belongsTo(models.Agent, { foreignKey: "agent_id" });
  };

  return AgentTool;
};
