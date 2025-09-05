module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define(
    "FAQ",
    {
      question: { type: DataTypes.STRING, allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "faqs",
      timestamps: true,
    }
  );
  return FAQ;
};
