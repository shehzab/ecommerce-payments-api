const stripe = require('../config/stripe');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    // Validate order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id.toString()
      },
      // For testing, you can add automatic payment methods
      payment_method_types: ['card'],
      description: `Payment for order #${order._id}`
    });
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm payment success (alternative to webhook for testing)
// @route   POST /api/payments/confirm-payment
// @access  Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    // Verify the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: `Payment not succeeded. Status: ${paymentIntent.status}`
      });
    }
    
    // Verify the order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email || req.user.email
    };
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: order
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment intent status
// @route   GET /api/payments/intent/:paymentIntentId
// @access  Private
exports.getPaymentIntentStatus = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.status(200).json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created
      }
    });
  } catch (error) {
    console.error('Get payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public
exports.webhookHandler = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object);
      break;
    default:
      console.log(`➡️ Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
};

// Handle successful payment intent
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.log('No order ID in payment intent metadata');
      return;
    }
    
    const order = await Order.findById(orderId);
    
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email
      };
      
      await order.save();
      console.log(`✅ Order ${orderId} marked as paid via webhook`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Handle failed payment intent
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    console.log(`❌ Payment failed for order: ${orderId}`);
    
    // You might want to update order status or notify the user
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentResult: {
          id: paymentIntent.id,
          status: 'failed',
          update_time: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// Handle successful charge
const handleChargeSucceeded = async (charge) => {
  try {
    console.log(`💳 Charge succeeded: ${charge.id}`);
    // You can add additional logic here if needed
  } catch (error) {
    console.error('Error handling charge success:', error);
  }
};