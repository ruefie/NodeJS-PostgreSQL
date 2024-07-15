const { body } = require('express-validator');

const validateOrder = [
  body('price')
    .isFloat().withMessage('Price must be a number')
    .notEmpty().withMessage('Price is required'),
  
  body('date')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date')
    .notEmpty().withMessage('Date is required'),
  
  body('user_id')
    .isInt().withMessage('User ID must be an integer')
    .notEmpty().withMessage('User ID is required'),
];

module.exports = validateOrder;
