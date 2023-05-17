const { tokenTypes } = require("../config/tokens");

const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user.model");

const sequelize = new Sequelize("databasename", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Assuming you have a User model/table
        key: "id",
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            tokenTypes.REFRESH,
            tokenTypes.RESET_PASSWORD,
            tokenTypes.VERIFY_EMAIL,
          ],
        ],
      },
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "tokens", // Customize the table name if needed
  }
);

module.exports = Token;
