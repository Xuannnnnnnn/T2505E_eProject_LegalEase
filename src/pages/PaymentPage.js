import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaQrcode,
  FaCreditCard,
  FaMoneyBillWave, // Giữ lại các icon có dùng
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import qrImage from "../assets/qr_example.png"; // ảnh QR thật

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);

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
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      status: "Paid",
      payment_method: paymentMethod,
    };
    existing.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(existing));

    setIsPaid(true);
    setTimeout(() => navigate("/payment-success"), 1500);
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <div
          className="card shadow-lg border-0 rounded-4 mx-auto"
          style={{ maxWidth: "650px" }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h4>Payment</h4>
          </div>

          <div className="card-body">
            {!isPaid ? (
              <form onSubmit={handlePayment}>
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

                <div className="d-flex gap-3 my-3">
                  <button
                    type="button"
                    className={`btn ${
                      paymentMethod === "QR Code"
                        ? "btn-success"
                        : "btn-outline-secondary"
                    } w-50`}
                    onClick={() => setPaymentMethod("QR Code")}
                  >
                    <FaQrcode className="me-2" />
                    QR Code
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      paymentMethod === "Credit Card"
                        ? "btn-success"
                        : "btn-outline-secondary"
                    } w-50`}
                    onClick={() => setPaymentMethod("Credit Card")}
                  >
                    <FaCreditCard className="me-2" />
                    Credit/Debit Card
                  </button>
                </div>

                {/* === QR PAYMENT === */}
                {paymentMethod === "QR Code" && (
                  <div className="text-center mt-4">
                    <h6>Scan this QR to complete your payment</h6>
                    <img
                      src={qrImage}
                      alt="QR Code"
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                    <p className="text-muted mt-2">
                      Use your banking app to scan and pay
                    </p>
                  </div>
                )}

                {/* === CREDIT CARD FORM === */}
                {paymentMethod === "Credit Card" && (
                  <div className="mt-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Name on Card</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">CVV</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="***"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 mt-4">
                  <FaMoneyBillWave className="me-2" /> Confirm Payment
                </button>
              </form>
            ) : (
              <div className="text-center my-5">
                <h3>✅ Payment Successful!</h3>
                <p>Your transaction has been processed successfully.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentPage;
