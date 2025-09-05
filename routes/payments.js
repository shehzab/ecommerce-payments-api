const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentIntentStatus,
  webhookHandler
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/intent/:paymentIntentId', protect, getPaymentIntentStatus);

// Webhook route (no authentication needed)
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

module.exports = router;