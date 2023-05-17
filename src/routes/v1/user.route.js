const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router
  .route("/")
  .get(
    auth("getUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  )
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .patch(auth(), userController.updateUser);

router.route("/profile").get(auth(), userController.getProfile);

router
  .route("/:userId")
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(
    auth(),
    validate(userValidation.updateUser),
    userController.updateUser
  );

router
  .route("/profile/:id")
  .patch(
    auth(),
    validate(userValidation.updateUserProfile),
    userController.updateUserProfile
  );

module.exports = router;
