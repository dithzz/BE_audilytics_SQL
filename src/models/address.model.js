const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user.model");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    line1: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    line2: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    line3: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "addresses", // Customize the table name if needed
  }
);

module.exports = Address;
