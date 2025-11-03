import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ManageLawyers() {
  const BASE_URL = "http://localhost:3001";
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🟢 Fetch list of lawyers
  useEffect(() => {
    fetch(`${BASE_URL}/lawyers`)
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.error("Error loading lawyers:", err));
  }, []);

  // 🟢 Approve / Reject lawyer
  const updateStatus = async (id, status) => {
    const lawyer = lawyers.find((l) => l.lawyer_id === id);
    if (!lawyer) return;

    const updated = {
      ...lawyer,
      status,
      verify_status: status === "Approved",
      approve_by: "Admin",
      approve_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BASE_URL}/lawyers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setLawyers(lawyers.map((l) => (l.lawyer_id === id ? updated : l)));
        alert(`Lawyer ${status.toLowerCase()} successfully!`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status!");
    }
  };

  // 🟢 View details in modal
  const handleView = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowModal(true);
  };

  // 🟢 Download base64 file
  const handleDownload = (fileData) => {
    if (!fileData?.data) return alert("No file data available!");

    const link = document.createElement("a");
    link.href = `data:${fileData.type};base64,${fileData.data}`;
    link.download = fileData.name || "downloaded_file";
    link.click();
  };

  return (
    <>
      <Header />
      <Container style={{ minHeight: "80vh", padding: "2rem 0" }}>
        <h3 className="text-center mb-4 fw-bold text-info">Manage Lawyers</h3>

        <Table striped bordered hover responsive>
          <thead className="table-info text-center">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {lawyers.length > 0 ? (
              lawyers.map((l) => (
                <tr key={l.lawyer_id}>
                  <td>{l.lawyer_id}</td>
                  <td>{l.name}</td>
                  <td>{l.email}</td>
                  <td>{l.specialization}</td>
                  <td>
                    <span
                      className={`badge ${
                        l.status === "Approved"
                          ? "bg-success"
                          : l.status === "Rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {l.status}
                    </span>
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
                          onClick={() => updateStatus(l.lawyer_id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => updateStatus(l.lawyer_id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No lawyers found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>

      {/* 🧩 Modal: View Lawyer Detail */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lawyer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLawyer && (
            <>
              <p><strong>Name:</strong> {selectedLawyer.name}</p>
              <p><strong>Email:</strong> {selectedLawyer.email}</p>
              <p><strong>Gender:</strong> {selectedLawyer.gender}</p>
              <p><strong>Specialization:</strong> {selectedLawyer.specialization}</p>
              <p><strong>Experience:</strong> {selectedLawyer.experience_years} years</p>
              <p><strong>Status:</strong> {selectedLawyer.status}</p>
              <p><strong>Registered At:</strong> {new Date(selectedLawyer.register_date).toLocaleString()}</p>

              <hr />
              <h6 className="fw-bold">Attached Files:</h6>
              <div className="d-flex flex-wrap gap-2">
                {selectedLawyer.degree_file && (
                  <Button variant="outline-primary" size="sm" onClick={() => handleDownload(selectedLawyer.degree_file)}>
                    Download Degree
                  </Button>
                )}
                {selectedLawyer.license_file && (
                  <Button variant="outline-success" size="sm" onClick={() => handleDownload(selectedLawyer.license_file)}>
                    Download License
                  </Button>
                )}
                {selectedLawyer.certificates && (
                  <Button variant="outline-warning" size="sm" onClick={() => handleDownload(selectedLawyer.certificates)}>
                    Download Certificates
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}

export default ManageLawyers;
