const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, default: () => Math.floor(100000 + Math.random() * 900000).toString() },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  paymentMethod: { type: String, default: 'Cash' },
  paymentStatus: { type: String, default: 'Pending' },
  specialInstructions: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);