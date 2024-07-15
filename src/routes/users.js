const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserOrders,
  checkInactiveUser,
} = require('../controllers/usersController');
const validate = require('../validators/validate');
const validateUser = require('../validators/userValidator');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateUser, validate, createUser);
router.put('/:id', validateUser, validate, updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/orders', getUserOrders);
router.put('/:id/check-inactive', checkInactiveUser);

module.exports = router;
