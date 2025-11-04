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
        return (
          <>
            <h3 className="fw-bold mb-4 text-primary">📋 Manage Lawyers</h3>
            <Table bordered hover responsive className="bg-white shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Degree File</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lawyers.map((l, index) => (
                  <tr key={l.id}>
                    <td>{index + 1}</td>
                    <td>{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.specialization}</td>
                    <td>
                      <Badge
                        bg={
                          l.status === "Approved"
                            ? "success"
                            : l.status === "Rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {l.status || "Pending"}
                      </Badge>
                    </td>
                    <td>
                      {l.degree_file ? (
                        <a href={l.degree_file.data} download={l.degree_file.name}>
                          📄 Download
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(l)}
                      >
                        View
                      </Button>
                      {l.status === "Pending" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleApprove(l)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(l)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal chi tiết lawyer */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Lawyer Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedLawyer ? (
                  <div>
                    {selectedLawyer?.image && (
                      <div className="text-center mb-3">
                        <img
                          src={
                            typeof selectedLawyer.image === "string"
                              ? selectedLawyer.image.startsWith("data:")
                                ? selectedLawyer.image
                                : `/${selectedLawyer.image}`
                              : selectedLawyer.image?.data
                          }
                          alt={selectedLawyer.name}
                          style={{
                            width: "180px",
                            height: "180px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "3px solid #007bff",
                          }}
                        />
                      </div>
                    )}

                    <p><strong>Full Name:</strong> {selectedLawyer.name}</p>
                    <p><strong>Email:</strong> {selectedLawyer.email}</p>
                    <p><strong>Phone:</strong> {selectedLawyer.phone}</p>
                    <p><strong>Address:</strong> {selectedLawyer.address}</p>
                    <p><strong>Specialization:</strong> {selectedLawyer.specialization}</p>
                    <p><strong>Experience:</strong> {selectedLawyer.experience_years} years</p>
                    <p><strong>Profile Summary:</strong></p>
                    <p>{selectedLawyer.profile_summary || "No summary provided."}</p>
                    <hr />
                    <h6>Uploaded Files:</h6>
                    <ul>
                      {selectedLawyer.degree_file && (
                        <li>
                          🎓 <a href={selectedLawyer.degree_file.data} download={selectedLawyer.degree_file.name}>Degree File</a>
                        </li>
                      )}
                      {selectedLawyer.license_file && (
                        <li>
                          📜 <a href={selectedLawyer.license_file.data} download={selectedLawyer.license_file.name}>License File</a>
                        </li>
                      )}
                      {selectedLawyer.certificates && (
                        <li>
                          🏅 <a href={selectedLawyer.certificates.data} download={selectedLawyer.certificates.name}>Certificates</a>
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p>No lawyer selected.</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                {!selectedLawyer?.verify_status && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleApprove(selectedLawyer);
                        setShowModal(false);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleReject(selectedLawyer);
                        setShowModal(false);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );

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
