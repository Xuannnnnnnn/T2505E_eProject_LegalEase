import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Badge } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "http://localhost:3001";

function PaymentEarningsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    pendingPayout: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/transactions`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();

        setTransactions(data);

        // ✅ Tính tổng hợp
        const successTx = data.filter((t) => t.status === "Success");
        const pendingTx = data.filter((t) => t.status === "Pending");

        const totalEarnings = successTx.reduce(
          (sum, t) => sum + Number(t.amount || 0),
          0
        );
        const pendingPayout = pendingTx.reduce(
          (sum, t) => sum + Number(t.amount || 0),
          0
        );

        setSummary({
          totalEarnings,
          totalTransactions: data.length,
          pendingPayout,
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Chuẩn bị dữ liệu cho biểu đồ theo tháng
  const earningsChartData = transactions.reduce((acc, t) => {
    if (!t.date) return acc;
    const month = new Date(t.date).toLocaleString("en-US", {
      month: "short",
    });
    const found = acc.find((x) => x.month === month);
    if (found) found.earnings += Number(t.amount);
    else acc.push({ month, earnings: Number(t.amount) });
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="fw-bold text-primary mb-4">💰 Earnings & Payments</h3>

      {/* Thống kê tổng quan */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Earnings</h6>
            <h4 className="text-success fw-bold">
              ${summary.totalEarnings.toFixed(2)}
            </h4>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Total Transactions</h6>
            <h4 className="text-primary fw-bold">{summary.totalTransactions}</h4>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm border-0 p-3 text-center">
            <h6 className="text-muted">Pending Payout</h6>
            <h4 className="text-warning fw-bold">
              ${summary.pendingPayout.toFixed(2)}
            </h4>
          </Card>
        </div>
      </div>

      {/* Biểu đồ thu nhập */}
      <Card className="shadow-sm border-0 p-4 mb-4">
        <h5 className="mb-3 text-secondary">📈 Monthly Earnings</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#007bff"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bảng lịch sử giao dịch */}
      <Card className="shadow-sm border-0 p-4">
        <h5 className="mb-3 text-secondary">🧾 Payment History</h5>
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Lawyer ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.id}>
                <td>{idx + 1}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.customer_id}</td>
                <td>{t.lawyer_id}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>
                  <Badge
                    bg={
                      t.status === "Success"
                        ? "success"
                        : t.status === "Pending"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {t.status}
                  </Badge>
                </td>
                <td>{t.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default PaymentEarningsPage;
