import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminAppointments from "./AdminAppointments"; // 👈 Import component quản lý lịch hẹn

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // 👈 thêm state quản lý tab
  const [appointments, setAppointments] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [lawyerStats, setLawyerStats] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(stored);

    const today = new Date().toISOString().slice(0, 10);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const start = startOfWeek.toISOString().slice(0, 10);

    const todayData = stored.filter((a) => a.appointment_date === today);
    const weekData = stored.filter(
      (a) => a.appointment_date >= start && a.appointment_date <= today
    );

    setTodayCount(todayData.length);
    setWeekCount(weekData.length);

    const grouped = {};
    stored.forEach((a) => {
      if (!grouped[a.lawyer_name]) {
        grouped[a.lawyer_name] = { success: 0, fail: 0 };
      }
      if (
        a.status?.toLowerCase() === "success" ||
        a.status?.toLowerCase() === "completed"
      ) {
        grouped[a.lawyer_name].success += 1;
      } else if (
        a.status?.toLowerCase() === "failed" ||
        a.status?.toLowerCase() === "cancelled"
      ) {
        grouped[a.lawyer_name].fail += 1;
      }
    });

    const stats = Object.keys(grouped).map((name) => ({
      name,
      ThànhCông: grouped[name].success,
      ThấtBại: grouped[name].fail,
    }));
    setLawyerStats(stats);
  }, []);

  const appointmentStats = [
    { name: "Hôm nay", value: todayCount },
    { name: "Tuần này", value: weekCount },
  ];

  const COLORS = ["#0d6efd", "#20c997"];

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <SidebarAdmin
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <Container fluid className="p-4 bg-light min-vh-100">
        {activeTab === "dashboard" && (
          <>
            <h3 className="fw-bold mb-4">📊 Admin Dashboard</h3>
            <Row>
              {/* Biểu đồ luật sư */}
              <Col md={8} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white fw-semibold">
                    Thống kê vụ tư vấn (Thành công / Thất bại)
                  </Card.Header>
                  <Card.Body>
                    {lawyerStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={lawyerStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ThànhCông" fill="#0d6efd" />
                          <Bar dataKey="ThấtBại" fill="#dc3545" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-muted">
                        Chưa có dữ liệu thống kê luật sư.
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Biểu đồ tròn */}
              <Col md={4} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-info text-white fw-semibold">
                    Đặt lịch khách hàng
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center">
                    {todayCount + weekCount > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={appointmentStats}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            label
                          >
                            {appointmentStats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-muted mt-5">
                        Chưa có dữ liệu đặt lịch.
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {activeTab === "appointments" && (
          <>
            <h3 className="fw-bold mb-4 text-primary">📅 Manage Appointments</h3>
            <AdminAppointments />
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
