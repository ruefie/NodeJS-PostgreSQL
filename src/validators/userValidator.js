const { body } = require('express-validator');

const validateUser = [
  body('first_name')
    .optional()
    .isString().withMessage('First name must be a string')
    // .notEmpty().withMessage('First name is required')
    .isLength({ max: 255 }).withMessage('First name can have a maximum length of 255 characters'),
  
  body('last_name')
    .optional()
    .isString().withMessage('Last name must be a string')
    // .notEmpty().withMessage('Last name is required')
    .isLength({ max: 255 }).withMessage('Last name can have a maximum length of 255 characters'),
  
  body('age')
    .optional()
    .isInt({ min: 0 }).withMessage('Age must be a positive integer'),
    // .notEmpty().withMessage('Age is required'),
  
  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),
];

module.exports = validateUser;
