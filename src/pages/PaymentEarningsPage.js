import React from "react";
import SummaryCard from "../components/SummaryCard";
import PaymentTable from "../components/PaymentTable";
import {
  summaryStats,
  earningsChartData,
  paymentHistory,
} from "../data/earningsData";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PaymentEarningsPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Earnings & Payments
      </h1>

      {/* Tổng quan thu nhập */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Earnings"
          value={`$${summaryStats.totalEarnings}`}
          color="text-green-600"
        />
        <SummaryCard
          title="Total Transactions"
          value={summaryStats.totalTransactions}
          color="text-blue-600"
        />
        <SummaryCard
          title="Pending Payout"
          value={`$${summaryStats.pendingPayout}`}
          color="text-yellow-600"
        />
      </div>

      {/* Biểu đồ thu nhập */}
      <div className="bg-white rounded-2xl shadow-md mb-8 p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Monthly Earnings
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsChartData}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#4F46E5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng lịch sử thanh toán */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Payment History
        </h2>
        <PaymentTable data={paymentHistory} />
      </div>
    </div>
  );
}

export default PaymentEarningsPage;
