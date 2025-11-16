// AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner, Modal, Button } from "react-bootstrap";
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
  const navigate = useNavigate();

  // Kiểm tra admin login
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // Fetch lawyers (chỉ khi tab lawyers active)
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

  // View lawyer
  const handleView = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowModal(true);
  };

  // Render tab
  const renderTab = () => {
    if (loading && activeTab === "lawyers") {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "lawyers":
        return <ManageLawyers 
                  lawyers={lawyers} 
                  onApprove={handleApprove} 
                  onReject={handleReject} 
                  onView={handleView} 
                />;
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
      default:
        return <div>Chọn tab bên trái để quản lý.</div>;
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      {/* Sidebar */}
      <SidebarAdmin
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <Container fluid className="p-4 flex-grow-1">
        {renderTab()}
      </Container>

      {/* Modal xem chi tiết lawyer */}
      {selectedLawyer && showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedLawyer.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Email:</strong> {selectedLawyer.email || "-"}</p>
            <p><strong>Status:</strong> {selectedLawyer.status || "-"}</p>
            <p><strong>Specialization:</strong> {selectedLawyer.specialization || "-"}</p>
            <p><strong>City:</strong> {selectedLawyer.city || "-"}</p>
            <p><strong>Profile Summary:</strong> {selectedLawyer.profile_summary || "-"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
