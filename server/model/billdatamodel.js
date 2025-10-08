// models/Bill.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productname: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const billSchema = new mongoose.Schema({
  customername: { type: String, required: true },
  invoiceno: { type: String, required: true },
  products: [productSchema],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
