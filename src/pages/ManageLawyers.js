import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Default date range = current year
  useEffect(() => {
    const year = new Date().getFullYear();
    setFromDate(new Date(year, 0, 1).toISOString().split("T")[0]);
    setToDate(new Date(year, 11, 31).toISOString().split("T")[0]);
  }, []);

  // Fetch lawyers
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        const data = await res.json();
        setLawyers(data || []);
        setFilteredLawyers(data || []);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = (lawyers || []).filter((l) => {
      const matchName = l.name?.toLowerCase().includes(nameFilter.toLowerCase());
      const matchStatus = statusFilter ? (l.status || "").toLowerCase() === statusFilter.toLowerCase() : true;
      const matchSpecialization = specializationFilter
        ? (l.specialization || "").toLowerCase().includes(specializationFilter.toLowerCase())
        : true;
      const matchGender = genderFilter ? (l.gender || "").toLowerCase() === genderFilter.toLowerCase() : true;

      let matchDate = true;
      const dateField = l.approve_at || l.register_date;
      if (dateField) {
        const d = new Date(dateField);
        if (fromDate && d < new Date(fromDate)) matchDate = false;
        if (toDate && d > new Date(toDate)) matchDate = false;
      }

      return matchName && matchStatus && matchSpecialization && matchGender && matchDate;
    });

    setFilteredLawyers(filtered);
    setCurrentPage(1);
  }, [nameFilter, statusFilter, specializationFilter, genderFilter, fromDate, toDate, lawyers]);

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(filteredLawyers.length / itemsPerPage));
  const currentItems = filteredLawyers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginate = (p) => {
  setCurrentPage(p);
  window.scrollTo({ top: 0, behavior: "smooth" }); // <<< thêm dòng này
  };

  // Actions: view, approve, reject
  const handleView = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowModal(true);
  };

  const handleApprove = async (lawyer) => {
    const updated = {
      verify_status: true,
      status: "Approved",
      approve_at: new Date().toISOString(),
      approve_by: "Admin",
    };
    try {
      await fetch(`${BASE_URL}/lawyers/${lawyer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setLawyers((prev) => prev.map((l) => (l.id === lawyer.id ? { ...l, ...updated } : l)));
      alert("✅ Lawyer approved!");
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve");
    }
  };

  const handleReject = async (lawyer) => {
    const updated = { verify_status: false, status: "Rejected" };
    try {
      await fetch(`${BASE_URL}/lawyers/${lawyer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setLawyers((prev) => prev.map((l) => (l.id === lawyer.id ? { ...l, ...updated } : l)));
      alert("❌ Lawyer rejected!");
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject");
    }
  };

  // Open file (support string path or base64 object)
  const openFile = (file) => {
    if (!file) return alert("No file available");
    // If string path -> open in new tab (assume served statically)
    if (typeof file === "string") {
      const url = file.startsWith("http") || file.startsWith("/") ? file : `/${file}`;
      window.open(url, "_blank");
      return;
    }

    // If object with base64 data
    if (file.data) {
      const href = `data:${file.type || "application/octet-stream"};base64,${file.data}`;
      const a = document.createElement("a");
      a.href = href;
      a.download = file.name || "file";
      a.click();
      return;
    }

    alert("Unsupported file format");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-0">
      <h3 className="text-center mb-4 fw-bold text-info">Manage Lawyers</h3>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
        <Form.Control
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ width: "200px" }}
        />

        <Form.Control
          placeholder="Specialization"
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
          style={{ width: "200px" }}
        />

        <Form.Select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="">All Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Form.Select>

        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Form.Select>

        <div className="d-flex align-items-center gap-1">
          <Form.Label className="m-0">From:</Form.Label>
          <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Form.Label className="m-0">To:</Form.Label>
          <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setNameFilter("");
            setSpecializationFilter("");
            setGenderFilter("");
            setStatusFilter("");
            const year = new Date().getFullYear();
            setFromDate(new Date(year, 0, 1).toISOString().split("T")[0]);
            setToDate(new Date(year, 11, 31).toISOString().split("T")[0]);
          }}
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table striped bordered hover responsive className="mt-3">
        <thead className="table-info text-center">
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Exp (yrs)</th>
            <th>Cases</th>
            <th>Rate ($/h)</th>
            <th>Rating</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Approved At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody className="text-center align-middle">
          {currentItems.length > 0 ? (
            currentItems.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td className="text-start">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {l.image && (
                      <img
                        src={typeof l.image === "string" && !l.image.startsWith("data:") ? l.image : (l.image?.data || l.image)}
                        alt={l.name}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                      />
                    )}
                    <div>
                      <div className="fw-semibold">{l.name}</div>
                      <div className="small text-muted">{l.city || ""}</div>
                    </div>
                  </div>
                </td>
                <td>{l.email}</td>
                <td>{l.specialization || "—"}</td>
                <td>{l.experience_years ?? "—"}</td>
                <td>{l.cases_handled ?? "—"}</td>
                <td>{l.hourly_rate ? `$${l.hourly_rate}` : "—"}</td>
                <td>{l.rating ?? "—"}</td>
                <td>{l.gender}</td>
                <td>
                  <span
                    className={`badge ${
                      l.status === "Approved" ? "bg-success" : l.status === "Rejected" ? "bg-danger" : "bg-secondary"
                    }`}
                  >
                    {l.status ?? "Pending"}
                  </span>
                </td>
                <td>{l.approve_at ? new Date(l.approve_at).toLocaleDateString() : "—"}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(l)}>
                    View
                  </Button>

                  {l.status === "Pending" && (
                    <>
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleApprove(l)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleReject(l)}>
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center">
                No lawyers found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Button variant="outline-primary" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
          Previous
        </Button>

        {[...Array(totalPages).keys()].map((num) => (
          <Button
            key={num + 1}
            onClick={() => paginate(num + 1)}
            className="mx-1"
            variant={currentPage === num + 1 ? "primary" : "outline-primary"}
          >
            {num + 1}
          </Button>
        ))}

        <Button variant="outline-primary" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
          Next
        </Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lawyer Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedLawyer ? (
            <>
              <div className="d-flex gap-3 align-items-start mb-3">
                {selectedLawyer.image && (
                  <img
                    src={typeof selectedLawyer.image === "string" && !selectedLawyer.image.startsWith("data:") ? selectedLawyer.image : (selectedLawyer.image?.data || selectedLawyer.image)}
                    alt={selectedLawyer.name}
                    style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8 }}
                  />
                )}

                <div>
                  <h4 className="mb-1">{selectedLawyer.name}</h4>
                  <div className="text-muted mb-2">{selectedLawyer.specialization}</div>
                  <div className="mb-2">
                    <strong>Rate:</strong> {selectedLawyer.hourly_rate ? `$${selectedLawyer.hourly_rate}/hr` : "—"} &nbsp; • &nbsp;
                    <strong>Rating:</strong> {selectedLawyer.rating ?? "—"} &nbsp; • &nbsp;
                    <strong>Experience:</strong> {selectedLawyer.experience_years ?? "—"} years
                  </div>
                  <div className="small text-muted">
                    <strong>Cases handled:</strong> {selectedLawyer.cases_handled ?? "—"}
                    <br />
                    <strong>Verified:</strong> {selectedLawyer.verify_status ? "Yes" : "No"} {selectedLawyer.approve_by ? `• by ${selectedLawyer.approve_by}` : ""}
                  </div>
                  <div className="mt-2">
                    <strong>Status:</strong>{" "}
                    <span className={`badge ${selectedLawyer.status === "Approved" ? "bg-success" : selectedLawyer.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                      {selectedLawyer.status ?? "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="fw-semibold">Profile Summary</h6>
                <p className="text-muted">{selectedLawyer.profile_summary || "No summary provided."}</p>
              </div>

              <Table bordered>
                <tbody>
                  <tr>
                    <th>Phone</th>
                    <td>{selectedLawyer.phone || "—"}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{selectedLawyer.city || "—"}</td>
                  </tr>
                  <tr>
                    <th>Approved At</th>
                    <td>{selectedLawyer.approve_at ? new Date(selectedLawyer.approve_at).toLocaleString() : "—"}</td>
                  </tr>
                  <tr>
                    <th>Approve By</th>
                    <td>{selectedLawyer.approve_by || "—"}</td>
                  </tr>
                </tbody>
              </Table>

              <div className="mt-3">
                <h6 className="fw-semibold">Documents</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {selectedLawyer.degree_file ? (
                    <Button variant="outline-primary" size="sm" onClick={() => openFile(selectedLawyer.degree_file)}>
                      Download Degree
                    </Button>
                  ) : null}
                  {selectedLawyer.license_file ? (
                    <Button variant="outline-success" size="sm" onClick={() => openFile(selectedLawyer.license_file)}>
                      Download License
                    </Button>
                  ) : null}
                  {selectedLawyer.certificates ? (
                    <Button variant="outline-warning" size="sm" onClick={() => openFile(selectedLawyer.certificates)}>
                      Download Certificates
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <p>No data.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageLawyers;
