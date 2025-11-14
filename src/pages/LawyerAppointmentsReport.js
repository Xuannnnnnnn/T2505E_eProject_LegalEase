// src/pages/LawyerAppointmentsReport.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Spinner, Form, Button } from "react-bootstrap";

const API_BASE = "http://localhost:3001";

// Hàm tiện ích: format date YYYY-MM-DD
const formatDate = (date) => new Date(date).toISOString().split("T")[0];

// Lấy đầu và cuối tháng hiện tại
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: formatDate(start), end: formatDate(end) };
};

const LawyerAppointmentsReport = () => {
  const navigate = useNavigate();
  const [loggedLawyer, setLoggedLawyer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Kiểm tra login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const role = localStorage.getItem("userRole");
    if (!storedUser || role !== "lawyer") {
      navigate("/login");
      return;
    }
    setLoggedLawyer(storedUser);

    // Set filter mặc định là tháng hiện tại
    const monthRange = getCurrentMonthRange();
    setFromDate(monthRange.start);
    setToDate(monthRange.end);
  }, [navigate]);

  // Load appointments
  const fetchAppointments = () => {
    if (!loggedLawyer) return;
    setLoading(true);
    const lawyerId = loggedLawyer.id || loggedLawyer.lawyer_id;

    fetch(`${API_BASE}/appointments?lawyer_id=${lawyerId}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, [loggedLawyer]);

  // Filter appointments theo ngày (hoặc tháng hiện tại)
  const filteredAppointments = appointments.filter((appt) => {
    if (fromDate && new Date(appt.appointment_date) < new Date(fromDate)) return false;
    if (toDate && new Date(appt.appointment_date) > new Date(toDate)) return false;
    return true;
  });

  // Tổng doanh thu
  const totalRevenue = filteredAppointments.reduce(
    (sum, appt) => sum + (parseFloat(appt.total_price) || 0),
    0
  );

  // Thống kê theo trạng thái
  const reportByStatus = filteredAppointments.reduce((acc, appt) => {
    const status = appt.status || "unknown";
    if (!acc[status]) acc[status] = { count: 0, total: 0 };
    acc[status].count += 1;
    acc[status].total += parseFloat(appt.total_price) || 0;
    return acc;
  }, {});

  if (!loggedLawyer) {
    return (
      <div className="text-center mt-5 text-secondary">
        Loading report... (Checking authentication)
      </div>
    );
  }

  return (
    <div className="p-4">
      

      {/* Filters */}
      <div className="mb-3 d-flex align-items-end gap-2 flex-wrap">
        <Form.Group>
          <Form.Label>From</Form.Label>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>To</Form.Label>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="secondary" onClick={() => {
          const monthRange = getCurrentMonthRange();
          setFromDate(monthRange.start);
          setToDate(monthRange.end);
        }}>
          Reset to Current Month
        </Button>
        <Button variant="primary" onClick={fetchAppointments}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <div>Loading appointments...</div>
        </div>
      ) : (
        <>
          <h5 className="mb-3">
            Total Appointments: {filteredAppointments.length} | Total Revenue: ${totalRevenue.toFixed(2)}
          </h5>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Status</th>
                <th>Number of Appointments</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(reportByStatus).map((status) => (
                <tr key={status}>
                  <td>{status.toUpperCase()}</td>
                  <td>{reportByStatus[status].count}</td>
                  <td>${reportByStatus[status].total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default LawyerAppointmentsReport;
