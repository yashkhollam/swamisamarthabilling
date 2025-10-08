import React, { useState } from "react";
import './bill.css';
import html2pdf from "html2pdf.js";

function Bill() {
  const [billData, setBillData] = useState({
    companyName: "",
    customerName: "",
    date: new Date().toLocaleDateString(),
    items: [],
  });

  const [product, setProduct] = useState({ name: "", qty: "", price: "" });

  const handleAddItem = () => {
    if (!product.name || !product.qty || !product.price) return;

    const total = Number(product.qty) * Number(product.price);
    setBillData({
      ...billData,
      items: [...billData.items, { ...product, total }],
    });
    setProduct({ name: "", qty: "", price: "" });
  };

  const calculateTotal = () => {
    return billData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleDownload = () => {
    const element = document.getElementById("billPreview");
    const opt = {
      margin: 0.5,
      filename: `${billData.customerName || "Bill"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app">
      <h1 className="heading">🧾 Bill Generator</h1>

      {/* Company and Customer Info */}
      <div className="form">
        <input
          type="text"
          placeholder="Company Name"
          value={billData.companyName}
          onChange={(e) =>
            setBillData({ ...billData, companyName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={billData.customerName}
          onChange={(e) =>
            setBillData({ ...billData, customerName: e.target.value })
          }
        />
      </div>

      {/* Product Input */}
      <div className="product-form">
        <input
          type="text"
          placeholder="Product"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Qty"
          value={product.qty}
          onChange={(e) => setProduct({ ...product, qty: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Product</button>
      </div>

      {/* Bill Preview */}
      <div id="billPreview" className="bill-preview">
        <h2>{billData.companyName || "Your Company Name"}</h2>
        <p>Date: {billData.date}</p>
        <p>Customer: {billData.customerName || "Customer Name"}</p>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="total">Grand Total: ₹{calculateTotal()}</h3>

        <p className="footer">Thank you for your purchase!</p>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download PDF
      </button>
    </div>
  );
}

export default Bill;
