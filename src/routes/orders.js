const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');
const validate = require('../validators/validate');
const validateOrder = require('../validators/orderValidator');

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validateOrder, validate, createOrder);
router.put('/:id', validateOrder, validate, updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
