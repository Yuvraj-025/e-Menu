const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  itemTotal: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  subTotal: {
    type: Number,
    required: true
  },
  tip: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
