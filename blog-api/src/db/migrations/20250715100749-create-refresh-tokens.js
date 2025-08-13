await queryInterface.createTable("refreshtokens", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  expires_at: {
    type: Sequelize.DATE,
  },
  is_revoked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});
