// models/Agent.js
module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define(
    "Agent",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      pattern: { type: DataTypes.STRING, allowNull: false, unique: true },
      systemPrompt: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "systemPrompt",
      },
      model: { type: DataTypes.STRING, defaultValue: "gpt-3.5-turbo" },
      temperature: { type: DataTypes.FLOAT, defaultValue: 0.7 },
      maxTokens: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "maxTokens",
      },
      description: { type: DataTypes.STRING, allowNull: true },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "isActive",
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
      tableName: "agents",
      underscored: true,
      timestamps: false,
    }
  );

  Agent.associate = (models) => {
    Agent.hasMany(models.AgentTool, { foreignKey: "agent_id" });
    Agent.hasMany(models.Conversation, { foreignKey: "agent_id" });
    Agent.hasMany(models.Message, { foreignKey: "agent_id" });
  };

  return Agent;
};
