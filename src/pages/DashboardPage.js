import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link } from "react-router-dom"; // <-- THÊM IMPORT NÀY
import { useNavigate } from "react-router-dom"; // thêm import

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BASE_URL = "http://localhost:3001";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalLawyers: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    totalTransactions: 0,
    totalPending: 0, // <-- THÊM MỚI
    totalAccepted: 0, // <-- THÊM MỚI
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [appointmentsPerLawyer, setAppointmentsPerLawyer] = useState({});
  const [transactionStatusStats, setTransactionStatusStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLawyers = await fetch(`${BASE_URL}/lawyers`);
        const lawyers = await resLawyers.json();

        const resCustomers = await fetch(`${BASE_URL}/customers`);
        const customers = await resCustomers.json();

        const resAppointments = await fetch(`${BASE_URL}/appointments`);
        const appointments = await resAppointments.json();

        const resTransactions = await fetch(`${BASE_URL}/transactions`);
        const transactions = await resTransactions.json();

        // --- BẮT ĐẦU THAY ĐỔI LOGIC ---

        // Tính toán số lượng lịch hẹn theo status
        // LƯU Ý: Hãy thay 'Pending' và 'Accepted' bằng status chính xác trong CSDL của bạn
        // (ví dụ: có thể là 'Confirmed', 'Approved', v.v.)
        const pendingAppointments = appointments.filter(
          (a) => a.status === "pending"
        ).length;

        const approvedAppointments = appointments.filter(
          (a) => a.status === "approved"
        ).length;


        // --- KẾT THÚC THAY ĐỔI LOGIC ---

        // Map appointments với tên luật sư
        const mappedAppointments = appointments
          .map((a) => {
            const lawyer = lawyers.find((l) => l.id === a.lawyer_id);
            return {
              ...a,
              lawyer_name: lawyer ? lawyer.name : "Unknown Lawyer",
            };
          })
          .sort(
            (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
          )
          .slice(0, 5);

        // Tính số appointments theo luật sư
        const perLawyer = {};
        appointments.forEach((a) => {
          const lawyer = lawyers.find((l) => l.id === a.lawyer_id);
          const name = lawyer ? lawyer.name : "Unknown Lawyer";
          perLawyer[name] = (perLawyer[name] || 0) + 1;
        });

        // Tính số transaction theo trạng thái
        const txStatus = {};
        transactions.forEach((t) => {
          const status = t.status || "Pending";
          txStatus[status] = (txStatus[status] || 0) + 1;
        });

        setStats({
          totalLawyers: lawyers.length,
          totalCustomers: customers.length,
          totalAppointments: appointments.length,
          totalTransactions: transactions.length,
          totalPending: pendingAppointments, // <-- SET STATE MỚI
          totalAccepted: approvedAppointments,
        });
        setRecentAppointments(mappedAppointments);
        setAppointmentsPerLawyer(perLawyer);
        setTransactionStatusStats(txStatus);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Chart data (Không thay đổi)
  const barData = {
    labels: Object.keys(appointmentsPerLawyer),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(appointmentsPerLawyer),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(transactionStatusStats),
    datasets: [
      {
        label: "Transactions",
        data: Object.values(transactionStatusStats),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-primary">Dashboard</h2>

      {/* --- BẮT ĐẦU THAY ĐỔI JSX CARDS --- */}
      <Row className="mb-4">
        {/* Total Lawyers */}
        <Col md={3}>
          <Link to="/admin/manage-lawyers" style={{ textDecoration: "none" }}>
            <Card className="text-center shadow-sm p-3 text-primary border-primary h-100">
              <Card.Body>
                <Card.Title>Total Lawyers</Card.Title>
                <Card.Text className="display-6">{stats.totalLawyers}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        {/* Total Customers */}
        <Col md={3}>
          <Link to="/admin/manage-customers" style={{ textDecoration: "none" }}>
            <Card className="text-center shadow-sm p-3 text-info border-info h-100">
              <Card.Body>
                <Card.Title>Total Customers</Card.Title>
                <Card.Text className="display-6">{stats.totalCustomers}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        {/* THAY THẾ CARD "Total Appointments" VÀ "Total Transactions" */}
        {/* Approved Appointments */}
        <Col md={3}>
          <Link
            to="/admin/manage-appointments?status=Accepted" // <-- Đổi path
            style={{ textDecoration: "none" }}
          >
            <Card className="text-center shadow-sm p-3 text-success border-success h-100">
              <Card.Body>
                <Card.Title>Total Pending</Card.Title>
                <Card.Text className="display-6">
                  {stats.totalPending}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        
        <Col md={3}>
          <Link
            to="/admin/manage-appointments?status=Approved"
            style={{ textDecoration: "none" }}
          >
            <Card className="text-center shadow-sm p-3 text-success border-success h-100">
              <Card.Body>
                <Card.Title>Total Approved</Card.Title>
                <Card.Text className="display-6">{stats.totalAccepted}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        
      </Row>
      {/* --- KẾT THÚC THAY ĐỔI JSX CARDS --- */}

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Card.Title>Appointments per Lawyer</Card.Title>
              <Bar
                data={barData}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Card.Title>Transactions by Status</Card.Title>
              <Pie data={pieData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3">Recent Appointments</h4>
      {recentAppointments.length === 0 ? (
        <p className="text-muted">No recent appointments.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Customer ID</th>
              <th>Lawyer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration (min)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.map((a, idx) => (
              <tr key={a.id}>
                <td>{idx + 1}</td>
                <td>{a.customer_name}</td>
                <td>{a.lawyer_name}</td>
                <td>{a.appointment_date}</td>
                <td>{a.appointment_time}</td>
                <td>{a.slot_duration}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DashboardPage;