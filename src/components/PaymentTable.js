import React from "react";

function PaymentTable({ data }) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b text-gray-600 bg-gray-100">
          <th className="p-3">Date</th>
          <th className="p-3">Client</th>
          <th className="p-3">Amount</th>
          <th className="p-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((payment) => (
          <tr
            key={payment.id}
            className="border-b hover:bg-gray-50 transition-all"
          >
            <td className="p-3">{payment.date}</td>
            <td className="p-3">{payment.client}</td>
            <td className="p-3 text-green-600 font-semibold">
              ${payment.amount}
            </td>
            <td
              className={`p-3 font-medium ${
                payment.status === "Paid"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {payment.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PaymentTable;
