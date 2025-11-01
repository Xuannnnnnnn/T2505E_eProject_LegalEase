import React from "react";

function SummaryCard({ title, value, color }) {
  return (
    <div className="shadow-lg rounded-2xl border border-gray-100 bg-white p-6 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-3xl font-semibold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

export default SummaryCard;
