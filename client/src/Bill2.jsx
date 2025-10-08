import React, { useState } from 'react';
import './Bill2.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Make sure Bootstrap is imported

function Bill2() {
  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_API_URL;

  const [billdata, setBilldata] = useState({
    customername: "",
    invoiceno: "",
    date: new Date().toLocaleDateString(),
    items: []
  });

  const [product, setProduct] = useState({ productname: "", quantity: "", price: "" });
  const [bills, setBills] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ Spinner state
  const [isLoading, setIsLoading] = useState(false);

  // Handle inputs
  const handleinputs = (e) => {
    const { name, value } = e.target;
    if (name === "customername" || name === "invoiceno") {
      setBilldata(prev => ({ ...prev, [name]: value }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add product
  const addProduct = () => {
    if (!product.productname || !product.quantity || !product.price) {
      alert("Please fill all product fields");
      return;
    }

    const total = Number(product.quantity) * Number(product.price);
    setBilldata(prev => ({
      ...prev,
      items: [...prev.items, { ...product, total }]
    }));
    setProduct({ productname: "", quantity: "", price: "" });
  };

  // ✅ Submit form with spinner
  const submitform = async (e) => {
    e.preventDefault();
    if (!billdata.customername) {
      alert("Please enter Customer Name");
      return;
    }
    if (billdata.items.length === 0) {
      alert("Add at least one product!");
      return;
    }

    setIsLoading(true); // show spinner

    try {
      const payload = {
        customername: billdata.customername,
        invoiceno: billdata.invoiceno,
        products: billdata.items,
        date: billdata.date
      };

      const res = await axios.post(`${apiurl}/bill/add`, payload);
      console.log("Bill submitted:", res.data);

      setBills(prev => [...prev, { ...payload, _id: res.data.data._id }]);
      setBilldata(prev => ({ ...prev, invoiceno: "", items: [] }));
      setProduct({ productname: "", quantity: "", price: "" });
    } catch (err) {
      console.error("Error submitting bill:", err);
      alert("Failed to submit bill. Check server.");
    } finally {
      setIsLoading(false); // hide spinner
    }
  };

  // ✅ Delete with spinner
  const deleteitem = async (billId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${apiurl}/bill/delete/${billId}`);
      setBills(prev => prev.filter(bill => bill._id !== billId));
    } catch (err) {
      console.error("Error deleting bill:", err);
      alert("Failed to delete bill. Check server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Open Edit Popup
  const openEditModal = (data, index) => {
    setEditingProduct({ ...data, billId: data.billId, index });
    setShowEditModal(true);
  };

  // ✅ Update with spinner
  const updateProduct = async () => {
    const { billId, index, productname, quantity, price } = editingProduct;
    const total = Number(quantity) * Number(price);

    setIsLoading(true);

    try {
      await axios.put(`${apiurl}/bill/updateproduct/${billId}`, {
        index,
        product: { productname, quantity, price, total }
      });

      setBills(prev =>
        prev.map(bill => {
          if (bill._id === billId) {
            const updatedProducts = [...bill.products];
            updatedProducts[index] = { productname, quantity, price, total };
            return { ...bill, products: updatedProducts };
          }
          return bill;
        })
      );

      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Check server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Flatten products for display
  const allproducts = bills.flatMap(bill =>
    bill.products.map((product, index) => ({
      ...product,
      billId: bill._id,
      invoiceno: bill.invoiceno,
      customername: bill.customername,
      index
    }))
  );

  const grandTotal = allproducts.reduce((acc, product) => acc + Number(product.total), 0);

  return (
    <>
      {/* ✅ Spinner overlay for all actions */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(211, 211, 211, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="spinner-border text-primary"
            style={{ width: "1.3rem", height: "1.3rem" }}
            role="status"
          ></div>
          <p className="mt-2 text-dark fw-bold">Processing...</p>
        </div>
      )}

      <div className="container-fluid mt-3" id="bill-cont">
        <div className="row" id="bill-row">
          <div className="col-12" id="bill-col">
            <h1 id="heading">||श्री स्वामी समर्थ प्रसन्न ||</h1>

            <form id="form" className="mt-4" onSubmit={submitform}>
              <input
                className="form-control"
                id="input-field"
                type="text"
                placeholder="Customer name"
                name="customername"
                value={billdata.customername}
                onChange={handleinputs}
              />

              <input
                className="form-control"
                id="input-field"
                type="text"
                placeholder="Product"
                name="productname"
                value={product.productname}
                onChange={handleinputs}
              />

              <div id="qtypricecont">
                <input
                  className="form-control"
                  id="input-field"
                  type="number"
                  placeholder="Qty"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleinputs}
                />
                <input
                  className="form-control"
                  id="input-field"
                  type="number"
                  placeholder="Price"
                  name="price"
                  value={product.price}
                  onChange={handleinputs}
                />
              </div>

              <input
                className="form-control"
                id="input-field"
                type="text"
                placeholder="Invoice no"
                name="invoiceno"
                value={billdata.invoiceno}
                onChange={handleinputs}
              />

              <div id="btn-cont">
                <button type="button" id="addbtn" onClick={addProduct}>
                  Add data
                </button>
                <button type="submit" id="submitbtn">
                  Submit Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-2" id="bill-cont">
        <div className="row" id="bill-row">
          {allproducts.length > 0 ? (
            allproducts.map((data, index) => (
              <div className="col-12 mt-3" key={`${data.billId}-${index}`}>
                <div className="card">
                  <p id="productname">{data.productname}</p>
                  <div id="data-cont">
                    <div id="data-price-cont" className="mt-2">
                      <span id="label" style={{ fontWeight: "bold" }}>
                        Price:
                      </span>
                      <span className="ms-2">{data.price}</span>
                      <span
                        id="label"
                        style={{ fontWeight: "bold", marginLeft: "20px" }}
                      >
                        Qty:
                      </span>
                      <span className="ms-2">{data.quantity}</span>
                    </div>

                    <div>
                      <button
                        id="editbtn"
                        onClick={() => openEditModal(data, index)}
                      >
                        edit
                      </button>
                      <button
                        id="deletebtn"
                        onClick={() => deleteitem(data.billId)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                  <div id="total-cont">
                    total : <p id="total">{data.total}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1>no data</h1>
          )}

          <div id="footer">
            <p>Total amount : {grandTotal}</p>
            <button
              onClick={() => {
                if (bills.length === 0) {
                  alert("No bills to preview");
                  return;
                }
                const latestBill = bills[bills.length - 1];
                navigate(`/previewbill/${latestBill._id}`);
              }}
            >
              Go to Download
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct.productname}
              onChange={(e) =>
                setEditingProduct((prev) => ({
                  ...prev,
                  productname: e.target.value,
                }))
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editingProduct.quantity}
              onChange={(e) =>
                setEditingProduct((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }))
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
            <div className="modal-buttons">
              <button
                onClick={() => setShowEditModal(false)}
                style={{ backgroundColor: "yellow" }}
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Bill2;
