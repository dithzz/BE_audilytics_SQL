const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../database");
const Address = require("./address.model");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        len: [8, Infinity],
        customValidator(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error(
              "Password must contain at least one letter and one number"
            );
          }
        },
      },
    },
    dob: {
      type: DataTypes.DATE,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users", // Customize the table name if needed
  }
);

User.beforeCreate(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {number} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
User.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    where: { email, id: { [Sequelize.Op.ne]: excludeUserId } },
  });
  return !!user;
};

User.prototype.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

User.hasMany(Address, { as: "addresses", foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

module.exports = User;
