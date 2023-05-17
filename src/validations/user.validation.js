const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      isApproved: Joi.boolean(),

      dob: Joi.string(),
      mobile: Joi.string(),
      addresses: Joi.array().items(
        Joi.object().keys({
          line1: Joi.string().required(),
          line2: Joi.string().required(),
          line3: Joi.string(),
          pincode: Joi.string().required(),
        })
      ),
    })
    .min(1),
};

const updateUserProfile = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      isApproved: Joi.boolean(),

      dob: Joi.string(),
      mobile: Joi.string(),
      address: Joi.array().items(
        Joi.object().keys({
          line1: Joi.string().required(),
          line2: Joi.string().required(),
          line3: Joi.string(),
          pincode: Joi.string().required(),
        })
      ),
    })
    .min(1),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserProfile,
};
