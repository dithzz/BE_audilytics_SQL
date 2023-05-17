const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { Address } = require("../models");
const { sequelize } = require("../database");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const { addresses, ...userData } = userBody;

  if (await User.isEmailTaken(userData.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const user = await User.create(userData);
  console.log(user.id, "dddddddddddddddddddddd");

  if (addresses) {
    const createdAddress = await Address.create({
      line1: addresses[0].line1,
      line2: addresses[0].line2,
      line3: addresses[0].line3,
      pincode: addresses[0].pincode,
      userId: user.id,
    });
    user.addresses = [createdAddress];
  }

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter) => {
  const whereClause = {};

  // Add filter conditions if provided
  if (filter.name) {
    whereClause.firstName = { [Sequelize.Op.like]: `%${filter.name}%` };
  }
  if (filter.role) {
    whereClause.role = filter.role;
  }

  const users = await User.findAll({
    where: whereClause,
  });

  return users.map((user) => user.toJSON());
};
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findByPk(id, { include: [{ model: Address, as: "addresses" }] });
};
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Update addresses if provided
  if (updateBody.addresses) {
    const addresses = await user.getAddresses();
    const updatedAddresses = updateBody.addresses;

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const updatedAddress = updatedAddresses[i];

      if (address && updatedAddress) {
        Object.assign(address, updatedAddress);
        await address.save();
      }
    }
  }

  // Update user fields
  Object.assign(user, updateBody);
  await user.save();

  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */

const updateProfileById = async (userId, updateBody) => {
  console.log(userId);
  const user = await getUserById(userId);

  console.log(user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Update user fields
  Object.assign(user, updateBody);
  await user.save();

  return user;
};
/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user || user.archived) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  updateProfileById,
};
