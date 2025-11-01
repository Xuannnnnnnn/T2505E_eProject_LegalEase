import React, { useState } from "react";

const FeedbackForm = ({ customerId }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter your feedback.");
      return;
    }

    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push({
      customer_id: customerId,
      message,
      date: new Date().toISOString(),
    });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    alert("Thank you for your feedback!");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
      <div className="mb-3">
        <label className="form-label">Your Feedback</label>
        <textarea
          className="form-control"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your comments here..."
        />
      </div>

      <button type="submit" className="btn btn-success">
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
