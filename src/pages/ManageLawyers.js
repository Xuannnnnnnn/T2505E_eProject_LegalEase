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
  const itemsPerPage = 10;

  // Bộ lọc
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Mặc định: Năm hiện tại
  useEffect(() => {
    const year = new Date().getFullYear();
    setFromDate(new Date(year, 0, 1).toISOString().split("T")[0]);
    setToDate(new Date(year, 11, 31).toISOString().split("T")[0]);
  }, []);

  // Lấy danh sách luật sư
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        const data = await res.json();
        setLawyers(data);
        setFilteredLawyers(data);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let filtered = lawyers.filter((l) => {
      const matchName = l.name?.toLowerCase().includes(nameFilter.toLowerCase());
      const matchStatus = statusFilter ? l.status === statusFilter : true;
      const matchSpecialization = specializationFilter
        ? l.specialization?.toLowerCase().includes(specializationFilter.toLowerCase())
        : true;
      const matchGender = genderFilter ? l.gender === genderFilter : true;

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
    setCurrentPage(1); // reset về trang 1 khi filter
  }, [nameFilter, statusFilter, specializationFilter, genderFilter, fromDate, toDate, lawyers]);

  // Phân trang
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredLawyers.slice(indexOfFirst, indexOfLast);

  const paginate = (page) => setCurrentPage(page);

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

  const handleReject = async (lawyer) => {
    const updated = { verify_status: false, status: "Rejected" };

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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4 fw-bold text-info">Manage Lawyers</h3>

      {/* Bộ lọc */}
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

      {/* Bảng danh sách */}
      <Table striped bordered hover responsive className="mt-3">
        <thead className="table-info text-center">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
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
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>{l.specialization || "—"}</td>
                <td>{l.gender}</td>
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
                <td>{l.approve_at ? new Date(l.approve_at).toLocaleDateString() : "—"}</td>

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
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">No lawyers found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 📌 Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
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

        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lawyer Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedLawyer && (
            <>
              {selectedLawyer.image && (
                <div className="text-center mb-3">
                  <img
                    src={selectedLawyer.image}
                    alt={selectedLawyer.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #0dcaf0",
                    }}
                  />
                </div>
              )}

              <Table bordered>
                <tbody>
                  <tr><th>Name</th><td>{selectedLawyer.name}</td></tr>
                  <tr><th>Email</th><td>{selectedLawyer.email}</td></tr>
                  <tr><th>Phone</th><td>{selectedLawyer.phone || "—"}</td></tr>
                  <tr><th>Gender</th><td>{selectedLawyer.gender}</td></tr>
                  <tr><th>Specialization</th><td>{selectedLawyer.specialization || "—"}</td></tr>
                  <tr><th>Experience</th><td>{selectedLawyer.experience_years || "—"}</td></tr>
                  <tr><th>Rating</th><td>{selectedLawyer.rating || "—"}</td></tr>
                  <tr><th>Status</th><td>{selectedLawyer.status}</td></tr>
                  <tr><th>Approved At</th>
                    <td>
                      {selectedLawyer.approve_at
                        ? new Date(selectedLawyer.approve_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
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
