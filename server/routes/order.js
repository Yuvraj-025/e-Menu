const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   POST /api/order
// @desc    Generate a bill/order summary from cart items
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let subTotal = 0;
    
    // In a real app we would verify prices against DB, 
    // but for this simple version we trust the client calculation
    const processedItems = items.map(item => {
      const itemTotal = item.price * item.quantity;
      subTotal += itemTotal;
      return {
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        itemTotal
      };
    });

    const tipAmount = req.body.tip || 0;
    const total = subTotal + tipAmount;

    const orderSummary = new Order({
      orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
      items: processedItems,
      subTotal: Number(subTotal.toFixed(2)),
      tip: Number(tipAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
      isPaid: false
    });

    await orderSummary.save();

    res.json(orderSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/order
// @desc    Get all orders sorted by date
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/order/:id/pay
// @desc    Toggle order paid status
// @access  Private/Admin
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.isPaid = !order.isPaid;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
