const objectId = (value, helpers) => {
  return value;
};

const password = (value, helpers) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (
    !value.match(/\d/) ||
    !value.match(/[a-zA-Z]/) ||
    !value.match(passwordRegex)
  ) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number and no special characters"
    );
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
