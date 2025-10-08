// controllers/billController.js
const Bill = require('../model/billdatamodel.js');

// Add new bill
exports.addBill = async (req, res) => {
  try {
    const { customername, invoiceno, products, date } = req.body;

    if (!customername || !invoiceno || !products || products.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Calculate total for each product if not already
    const productsWithTotal = products.map(p => ({
      ...p,
      total: Number(p.quantity) * Number(p.price)
    }));

    const newBill = new Bill({
      customername,
      invoiceno,
      products: productsWithTotal,
      date: date || new Date()
    });

    const savedBill = await newBill.save();
    res.status(201).json({ success: true, message: "Bill added successfully", data: savedBill });
  } catch (err) {
    console.error("Error in addBill:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete bill by ID
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.json({ success: true, message: "Bill deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBill:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get bill by customer name
exports.getBillsByCustomer = async (req, res) => {
  try {
    const { customername } = req.params;
    const bills = await Bill.find({ customername }).sort({ date: -1 });
    res.json({ success: true, message: "Bills fetched successfully", data: bills });
  } catch (err) {
    console.error("Error in getBillsByCustomer:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single bill by ID (for preview)
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, message: "Bill fetched", data: bill });
  } catch (err) {
    console.error("Error in getBillById:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // bill ID
    const { index, product } = req.body; // index of product and new data

    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });

    // Update product
    bill.products[index] = product;
    await bill.save();

    res.json({ success: true, message: "Product updated", data: bill });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
