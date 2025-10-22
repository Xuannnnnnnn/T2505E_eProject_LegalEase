import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function PaymentSuccess() {
  return (
    <div className="container text-center my-5">
      <FaCheckCircle className="text-success" size={80} />
      <h2 className="mt-3 text-success">Payment Successful!</h2>
      <p className="text-muted">Your appointment has been booked successfully.</p>
      <div className="mt-4">
        <Link to="/appointment-history" className="btn btn-outline-primary me-2">
          View Appointment History
        </Link>
        <Link to="/search" className="btn btn-primary">
          Back to Search
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
