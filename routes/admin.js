const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  getSalesStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/orders')
  .get(getOrders);

router.route('/sales-stats')
  .get(getSalesStats);

module.exports = router;