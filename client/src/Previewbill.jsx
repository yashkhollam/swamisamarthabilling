import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './billPreview.css';

const numberToWords = (num) => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + a[num % 10] : "");
  if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
  if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
  return num;
};

function PreviewBill() {
  const navigate = useNavigate();
  const { billId } = useParams();
  const apiurl = import.meta.env.VITE_API_URL;

  const [billData, setBillData] = useState({
    invoiceno: "",
    customerName: "",
    date: "",
    products: [],
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchBill = async () => {
    try {
      if (!billId) return;
      const res = await axios.get(`${apiurl}/bill/${billId}`);
      const bill = res.data.data;
      if (bill) {
        setBillData({
          invoiceno: bill.invoiceno,
          customerName: bill.customername,
          date: formatDate(bill.date),
          products: bill.products || [],
        });
      }
    } catch (err) {
      console.error("Error fetching bill:", err);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [billId]);

  const grandTotal = billData.products.reduce(
    (acc, product) => acc + Number(product.total),
    0
  );

  const downloadPDF = () => {
    const element = document.getElementById('billPreview');
    const buttons = element.querySelectorAll('.no-pdf');

    // Hide buttons
    buttons.forEach(btn => btn.style.display = 'none');

    // Force A4 size
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.padding = '10mm';
    element.style.boxSizing = 'border-box';
    element.style.background = 'white';
    element.style.margin = '0 auto';
    element.style.border = '2px solid black';

    const opt = {
      margin: [0, 0, 0, 0],
      filename: `Invoice_${billData.invoiceno}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore after PDF
      buttons.forEach(btn => btn.style.display = 'block');
      element.style.width = '';
      element.style.minHeight = '';
      element.style.padding = '';
      element.style.background = '';
      element.style.margin = '';
      element.style.border = '';
    });
  };

  return (
   <div className="container-fluid preview-bill-container d-flex justify-content-center">
  {/* Outer container for PDF scaling */}
  <div className="bill-outer p-2" id="billPreview" style={{ backgroundColor: "white" }}>
    
    {/* Inner container with border for actual bill */}
    <div className="bill-inner p-4" style={{ border: "2px solid black", width: "100%", boxSizing: "border-box" }}>
      
      {/* Header */}
      <div className="bill-header mb-4 text-center">
        <h1 className='ownerhead'>SHRI SWAMI SAMARTHA PRINTERS</h1>
        <p className='subheading1'>All types of printing & Binding work done here</p>
        <p className='subheading2'>We supply all types of industrial stationary</p>
        <p className='address'>Address : PIMPRI-CHINCHWAD PUNE-411034</p>

        {/* Customer Info with border */}
        <div className='company-info d-flex justify-content-between mt-3 p-2' style={{ border: "2px solid black" }}>
          <div>
            <p style={{ fontWeight: "bold" }}>To :</p>
            <p>{billData.customerName}</p>
          </div>
          <div className='text-center'>
            <p style={{ backgroundColor: "black", color: "white", fontWeight: "bold", fontSize: "1.4rem" }}>INVOICE</p>
            <p>INVOICE NO : {billData.invoiceno}</p>
            <p style={{ fontWeight: "bold" }}>Date : {billData.date}</p>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <table className="table table-striped text-center border">
        <thead className="table-dark">
          <tr>
            <th>No.</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {billData.products.length > 0 ? billData.products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.productname}</td>
              <td>{product.quantity}</td>
              <td>{product.price}</td>
              <td>{product.total}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5}>No products added</td>
            </tr>
          )}
          {billData.products.length > 0 && (
            <tr className="table-secondary">
              <td colSpan={4} style={{ fontWeight: "bold" }}>TOTAL</td>
              <td style={{ fontWeight: "bold" }}>{grandTotal}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Grand Total in Words */}
      <div className="grand-total-words text-start mb-4" style={{ fontWeight: "bold" }}>
        <p>Rupees in word: {numberToWords(grandTotal)} Rupees Only</p>
      </div>

      {/* Footer */}
      <div className="bill-footer mt-5 text-center border-top pt-3">
        <p style={{ fontWeight: "bold" }}>For, SHRI SWAMI SAMARTHA PRINTERS</p>
        <div className="row mt-5">
          <div className="col text-start">
            <p>Receiver's Signature</p>
          </div>
          <div className="col text-end">
            <p>Signature</p>
          </div>
        </div>
      </div>

    </div> {/* End bill-inner */}

    {/* Buttons outside the border */}
    <div className="d-flex justify-content-center mt-4 no-pdf">
      <button className="btn btn-primary me-2" onClick={downloadPDF}>Download PDF</button>
      <button className="btn btn-warning" onClick={() => navigate('/')}>Back</button>
    </div>

  </div>
</div>

  );
}

export default PreviewBill;
