import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này
import { Container, Table, Button, Badge, Modal, Spinner } from "react-bootstrap";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminExpenseManagementPage from "./AdminExpenseManagementPage";
import ManageContentPage from "./ManageContentPage";
import AdminAppointments from "./AdminAppointments";
import ManageCustomerPage from "./ManageCustomerPage";
import ManageTransactionsPage from "./ManageTransactionsPage";
import DashboardPage from "./DashboardPage";
import ManageLawyers from "./ManageLawyers";

const BASE_URL = "http://localhost:3001";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // ✅ thêm dòng này ngay đầu hàm
  // ✅ Kiểm tra xem admin đã đăng nhập chưa
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // ✅ Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };
  // Fetch lawyers
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        const data = await res.json();
        setLawyers(data);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "lawyers") fetchLawyers();
  }, [activeTab]);

  // Approve lawyer
  const handleApprove = async (lawyer) => {
    const updated = {
      verify_status: true,
      status: "Approved",
      approve_at: new Date().toISOString(),
      approve_by: "Admin",
    };
    await fetch(`${BASE_URL}/lawyers/${lawyer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setLawyers((prev) =>
      prev.map((l) => (l.id === lawyer.id ? { ...l, ...updated } : l))
    );
    alert("✅ Lawyer approved!");
  };

  // Reject lawyer
  const handleReject = async (lawyer) => {
    const updated = {
      verify_status: false,
      status: "Rejected",
    };
    await fetch(`${BASE_URL}/lawyers/${lawyer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setLawyers((prev) =>
      prev.map((l) => (l.id === lawyer.id ? { ...l, ...updated } : l))
    );
    alert("❌ Lawyer rejected!");
  };

  // View lawyer details
  const handleView = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowModal(true);
  };

  // Render content theo tab
  const renderTab = () => {
    if (loading && activeTab === "lawyers") {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    switch (activeTab) {
      case "lawyers":
        return <ManageLawyers />;

      case "fees":
        return <AdminExpenseManagementPage />;
      
      case "content":
        return <ManageContentPage />;
      
      case "appointments":
      return <AdminAppointments />;

      case "customers":
      return <ManageCustomerPage />;

      case "transactions":
      return <ManageTransactionsPage />;

      case "dashboard":
      return <DashboardPage />;

      default:
        return <div>Chọn tab bên trái để quản lý.</div>;
    }
  };

  return (
    <div className="d-flex">
      {/* 🟢 Thêm onLogout={handleLogout} ở đây */}
      <SidebarAdmin
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <Container fluid className="p-4">
        {renderTab()}
      </Container>
    </div>
  );
};

export default AdminDashboard;
