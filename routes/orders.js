const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUserOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;