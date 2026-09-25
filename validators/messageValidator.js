const { body } = require("express-validator");

const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Text cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Text cannot exceed 255 characters"),
];

module.exports = validateMessage;
