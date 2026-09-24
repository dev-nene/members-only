const { body } = require("express-validator");

const validateUser = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ max: 20 })
    .withMessage("first name cannot exceed 20 characters"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ max: 20 })
    .withMessage("last name cannot exceed 20 characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ max: 20 })
    .withMessage("username cannot exceed 20 characters"),
  body("password").notEmpty().withMessage("password is required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("password must match"),
];

module.exports = validateUser;
