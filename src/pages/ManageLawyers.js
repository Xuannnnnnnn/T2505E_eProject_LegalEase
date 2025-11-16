import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({
    name: "",
    specialization: "",
    gender: "",
    status: "",
    fromDate: "",
    toDate: ""
  });

  useEffect(() => {
    const year = new Date().getFullYear();
    setFilters((p) => ({
      ...p,
      fromDate: new Date(year, 0, 1).toISOString().split("T")[0],
      toDate: new Date(year, 11, 31).toISOString().split("T")[0],
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/lawyers`);
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        
        // --- SỬA LOGIC SẮP XẾP ---
        // Ưu tiên "Pending" lên đầu, sau đó sắp xếp theo ngày đăng ký mới nhất
        data.sort((a, b) => {
          const aIsPending = (a.status || "Pending") === "Pending";
          const bIsPending = (b.status || "Pending") === "Pending";

          if (aIsPending && !bIsPending) {
            return -1; // a (Pending) lên trước
          }
          if (!aIsPending && bIsPending) {
            return 1; // b (Pending) lên trước
          }

          // Nếu cả hai cùng trạng thái, sắp xếp theo ngày đăng ký
          return new Date(b.register_date) - new Date(a.register_date);
        });
        
        setLawyers(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = (list) => {
    return list.filter((l) => {
      const nameMatch = l.name?.toLowerCase().includes(filters.name.toLowerCase());
      const specMatch = l.specialization?.toLowerCase().includes(filters.specialization.toLowerCase());
      const genderMatch = filters.gender ? l.gender?.toLowerCase() === filters.gender.toLowerCase() : true;
      const statusMatch = filters.status ? (l.status || "").toLowerCase() === filters.status.toLowerCase() : true;

      let dateMatch = true;
      const dateField = l.approve_at || l.register_date;
      if (dateField) {
        const d = new Date(dateField);
        if (filters.fromDate && d < new Date(filters.fromDate)) dateMatch = false;
        if (filters.toDate && d > new Date(filters.toDate)) dateMatch = false;
      }

      return nameMatch && specMatch && genderMatch && statusMatch && dateMatch;
    });
  };

  const filteredLawyers = useMemo(() => applyFilters(lawyers), [filters, lawyers]);
  const totalPages = Math.max(1, Math.ceil(filteredLawyers.length / itemsPerPage));
  const currentItems = useMemo(() => {
    return filteredLawyers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredLawyers, currentPage]);

  const patchLawyer = async (id, payload) => {
    const res = await fetch(`${BASE_URL}/lawyers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  };

  const handleApprove = async (l) => {
    const payload = {
      verify_status: true,
      status: "Approved",
      approve_at: new Date().toISOString(),
      approve_by: "Admin",
    };
    try {
      await patchLawyer(l.id, payload);
      setLawyers((p) => p.map((x) => (x.id === l.id ? { ...x, ...payload } : x)));
      alert("Approved!");
    } catch (e) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (l) => {
    const payload = { verify_status: false, status: "Rejected" };
    try {
      await patchLawyer(l.id, payload);
      setLawyers((p) => p.map((x) => (x.id === l.id ? { ...x, ...payload } : x)));
      alert("Rejected!");
    } catch (e) {
      alert("Failed to reject");
    }
  };

  // --- 1. SỬA HÀM startEdit (Version 2.1) ---
  // Chuyển tất cả giá trị sang string để Form.Control hoạt động ổn định
  // Dùng ?? (nullish coalescing) để xử lý null/undefined
  const startEdit = (l) => {
    setEditingId(l.id);
    setEditData({
      hourly_rate: String(l.hourly_rate ?? ""), // (null, undefined, "") -> ""
      rating: String(l.rating ?? 0), // (null, undefined, 0) -> "0"
      experience_years: String(l.experience_years ?? ""),
      cases_handled: String(l.cases_handled ?? ""),
    });
  };

  // --- 2. SỬA HÀM saveEdit (Version 2.1) ---
  // Chuyển đổi lại kiểu dữ liệu cho đúng với db.json
  const saveEdit = async (id) => {
    const payload = {
      // LUÔN LƯU DƯỚI DẠNG STRING (giống db.json)
      // Nếu editData.hourly_rate là "50" -> lưu "50"
      // Nếu editData.hourly_rate là "" -> lưu ""
      // Nếu editData.hourly_rate là "0" -> lưu "0"
      hourly_rate: String(editData.hourly_rate ?? ""),
      experience_years: String(editData.experience_years ?? ""),
      cases_handled: String(editData.cases_handled ?? ""),
      
      // 'rating' là trường duy nhất luôn là SỐ
      rating: Number(editData.rating) || 0,
    };
    try {
      await patchLawyer(id, payload);
      setLawyers((p) => p.map((x) => (x.id === id ? { ...x, ...payload } : x)));
      setEditingId(null);
      alert("Updated successfully");
    } catch (e) {
      alert("Update failed");
    }
  };

  const resolveImage = (img) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (img.data) return `data:${img.type || "image/jpeg"};base64,${img.data}`;
    return null;
  };

  const openFile = (file) => {
    if (!file) return alert("No file");
    if (typeof file === "string") return window.open(file, "_blank");
    if (file.data) {
      const link = document.createElement("a");
      link.href = `data:${file.type};base64,${file.data}`;
      link.download = file.name || "file";
      link.click();
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container my-0">
      <h3 className="text-center mb-4 fw-bold text-info">Manage Lawyers</h3>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-end">
        <Form.Control
          placeholder="Search name"
          style={{ width: 180 }}
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <Form.Control
          placeholder="Specialization"
          style={{ width: 180 }}
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
        />

        <Form.Select
          style={{ width: 150 }}
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">All Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Form.Select>

        <Form.Select
          style={{ width: 150 }}
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Form.Select>

        <Form.Control
          type="date"
          style={{ width: 160 }}
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />

        <Form.Control
          type="date"
          style={{ width: 160 }}
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />

        <Button
          variant="secondary"
          onClick={() => {
            const year = new Date().getFullYear();
            setFilters({
              name: "",
              specialization: "",
              gender: "",
              status: "",
              fromDate: new Date(year, 0, 1).toISOString().split("T")[0],
              toDate: new Date(year, 11, 31).toISOString().split("T")[0],
            });
          }}
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead className="table-info text-center">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Exp</th>
            <th>Cases</th>
            <th>Rate</th>
            <th>Rating</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Approved At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {currentItems.length ? (
            currentItems.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>

                <td className="text-start">
                  <div className="d-flex align-items-center gap-2">
                    {resolveImage(l.image) && (
                      <img
                        src={resolveImage(l.image)}
                        alt={l.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
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

                <td>
                  {editingId === l.id ? (
                    <Form.Control
                      size="sm"
                      type="number"
                      value={editData.experience_years}
                      onChange={(e) => setEditData({ ...editData, experience_years: e.target.value })}
                    />
                  ) : (
                    l.experience_years || "—"
                  )}
                </td>

                <td>
                  {editingId === l.id ? (
                    <Form.Control
                      size="sm"
                      type="number"
                      value={editData.cases_handled}
                      onChange={(e) => setEditData({ ...editData, cases_handled: e.target.value })}
                    />
                  ) : (
                    l.cases_handled || "—"
                  )}
                </td>

                <td>
                  {editingId === l.id ? (
                    <Form.Control
                      size="sm"
                      type="number"
                      value={editData.hourly_rate}
                      onChange={(e) => setEditData({ ...editData, hourly_rate: e.target.value })}
                    />
                  ) : (
                    l.hourly_rate ? `$${l.hourly_rate}` : "—"
                  )}
                </td>

                <td>
                  {editingId === l.id ? (
                    <Form.Control
                      size="sm"
                      type="number"
                      value={editData.rating}
                      onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                    />
                  ) : (
                    l.rating || 0
                  )}
                </td>

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
                    {l.status || "Pending"}
                  </span>
                </td>

                <td>{l.approve_at ? new Date(l.approve_at).toLocaleDateString() : "—"}</td>

                <td>
                  {editingId === l.id ? (
                    <>
                      <Button size="sm" variant="success" className="me-1" onClick={() => saveEdit(l.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="info" className="me-1" onClick={() => { setSelectedLawyer(l); setShowModal(true); }}>
                        View
                      </Button>
                      <Button size="sm" variant="warning" className="me-1" onClick={() => startEdit(l)}>
                        Edit
                      </Button>
                      {l.status === "Pending" && (
                        <>
                          <Button size="sm" variant="success" className="me-1" onClick={() => handleApprove(l)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleReject(l)}>
                            Reject
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={12}>No lawyers found.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>

        {[...Array(totalPages).keys()].map((i) => (
          <Button
            key={i}
            className="mx-1"
            variant={currentPage === i + 1 ? "primary" : "outline-primary"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lawyer Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedLawyer && (
            <>
              <div className="d-flex gap-3 mb-3">
                {resolveImage(selectedLawyer.image) && (
                  <img
                    src={resolveImage(selectedLawyer.image)}
                    alt={selectedLawyer.name}
                    style={{ width: 140, height: 140, borderRadius: 8, objectFit: "cover" }}
                  />
                )}

                <div>
                  <h4>{selectedLawyer.name}</h4>
                  <div className="text-muted mb-2">{selectedLawyer.specialization}</div>
                  <div className="mb-2">
                    <strong>Rate:</strong> {selectedLawyer.hourly_rate ? `$${selectedLawyer.hourly_rate}` : "—"}
                    &nbsp; • &nbsp;
                    <strong>Rating:</strong> {selectedLawyer.rating || 0}
                    &nbsp; • &nbsp;
                    <strong>Experience:</strong> {selectedLawyer.experience_years || "—"}
                  </div>

                  <div className="small text-muted">
                    <strong>Verified:</strong> {selectedLawyer.verify_status ? "Yes" : "No"}
                    {selectedLawyer.approve_by && ` • by ${selectedLawyer.approve_by}`}
                  </div>
                </div>
              </div>

              <Table bordered>
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{selectedLawyer.email}</td>
                  </tr>
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
                </tbody>
              </Table>

              <h6 className="fw-semibold mt-3">Documents</h6>
              <div className="d-flex gap-2">
                {selectedLawyer.degree_file && (
                  <Button size="sm" variant="outline-primary" onClick={() => openFile(selectedLawyer.degree_file)}>
                    Degree
                  </Button>
                )}
                {selectedLawyer.license_file && (
                  <Button size="sm" variant="outline-success" onClick={() => openFile(selectedLawyer.license_file)}>
                    License
                  </Button>
                )}
                {selectedLawyer.certificates && (
                  <Button size="sm" variant="outline-warning" onClick={() => openFile(selectedLawyer.certificates)}>
                    Certificates
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageLawyers;