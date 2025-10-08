// routes/billRoutes.js
const express = require('express');
const router = express.Router();
const billController = require('../Controller/billingdata.js');

// Add new bill
router.post('/add', billController.addBill);

// Delete bill by ID
router.delete('/delete/:id', billController.deleteBill);

// Get all bills of a customer (used for preview by customer ID or name)
router.get('/getbycustomer/:id', billController.getBillsByCustomer);

// Get single bill by ID (for preview page)
router.get('/:id', billController.getBillById);

router.put('/updateproduct/:id', billController.updateProduct);


module.exports = router;
