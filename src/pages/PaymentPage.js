import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaQrcode, FaCreditCard, FaUniversity, FaMoneyBillWave } from "react-icons/fa";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;

  // ✅ Hook phải được khai báo ở đầu component, trước mọi return hoặc điều kiện
  const [paymentMethod, setPaymentMethod] = useState("");

  if (!appointment) {
    return (
      <div className="container text-center my-5">
        <h4>No appointment data found.</h4>
        <Link to="/search" className="btn btn-primary mt-3">
          Back to Search
        </Link>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please choose a payment method.");
      return;
    }

    // ✅ Save appointment to localStorage
    const existing = JSON.parse(localStorage.getItem("appointments")) || [];
    const newAppointment = { ...appointment, id: Date.now(), status: "Paid" };
    existing.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(existing));

    alert("✅ Payment successful!");
    navigate("/payment-success");
  };

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 rounded-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-header bg-primary text-white text-center">
          <h4>Payment</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Lawyer:</strong> {appointment.lawyer_name}
          </p>
          <p>
            <strong>Date:</strong> {appointment.appointment_date}
          </p>
          <p>
            <strong>Total:</strong> ${appointment.total_price.toFixed(2)}
          </p>

          <h5 className="mt-4">Choose Payment Method</h5>
          <form onSubmit={handlePayment}>
            <div className="form-check">
              <input
                type="radio"
                name="payment"
                value="QR Code"
                checked={paymentMethod === "QR Code"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-check-input"
              />
              <label className="form-check-label">
                <FaQrcode className="me-2" /> QR Code
              </label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                name="payment"
                value="Credit Card"
                checked={paymentMethod === "Credit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-check-input"
              />
              <label className="form-check-label">
                <FaCreditCard className="me-2" /> Credit Card
              </label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                name="payment"
                value="Bank Transfer"
                checked={paymentMethod === "Bank Transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-check-input"
              />
              <label className="form-check-label">
                <FaUniversity className="me-2" /> Bank Transfer
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              <FaMoneyBillWave className="me-2" /> Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
