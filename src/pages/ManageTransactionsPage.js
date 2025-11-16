// src/pages/ManageTransactionsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  Modal,
  Spinner,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    customer: "",
    lawyer: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentItems = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  // 🔹 Mặc định lọc theo NĂM HIỆN TẠI
  useEffect(() => {
    const year = new Date().getFullYear();
    const firstDayYear = new Date(year, 0, 1);
    const lastDayYear = new Date(year, 11, 31);
    setFilters((prev) => ({
      ...prev,
      startDate: firstDayYear.toISOString().split("T")[0],
      endDate: lastDayYear.toISOString().split("T")[0],
    }));
  }, []);

  // 🔹 Load dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTx, resCus, resLaw, resAppt] = await Promise.all([
          fetch(`${BASE_URL}/transactions`),
          fetch(`${BASE_URL}/customers`),
          fetch(`${BASE_URL}/lawyers`),
          fetch(`${BASE_URL}/appointments`),
        ]);

        if (!resTx.ok || !resCus.ok || !resLaw.ok || !resAppt.ok)
          throw new Error("Failed to fetch data");

        const [txData, customers, lawyers, appointments] = await Promise.all([
          resTx.json(),
          resCus.json(),
          resLaw.json(),
          resAppt.json(),
        ]);

        const mappedData = txData.map((t) => {
          const appt = appointments.find(
            (a) => String(a.id) === String(t.appointment_id)
          );

          const customer = customers.find(
            (c) => String(c.id) === String(appt?.customer_id || t.customer_id)
          );

          const lawyer = lawyers.find(
            (l) => String(l.id) === String(appt?.lawyer_id || t.lawyer_id)
          );

          return {
            ...t,
            appointment_date: appt?.appointment_date || t.date || "",
            customer_name: customer ? customer.fullname : "Unknown Customer",
            lawyer_name: lawyer ? lawyer.fullname || lawyer.name : "Unknown Lawyer",
          };
        });

        setTransactions(mappedData);
        setFilteredTransactions(mappedData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Áp dụng bộ lọc
  useEffect(() => {
    let result = [...transactions];
    const { customer, lawyer, status, startDate, endDate } = filters;

    if (customer) {
      result = result.filter((t) =>
        t.customer_name.toLowerCase().includes(customer.toLowerCase())
      );
    }

    if (lawyer) {
      result = result.filter((t) =>
        t.lawyer_name.toLowerCase().includes(lawyer.toLowerCase())
      );
    }

    if (status) {
      result = result.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (startDate) {
      result = result.filter(
        (t) => new Date(t.appointment_date) >= new Date(startDate)
      );
    }

    if (endDate) {
      result = result.filter(
        (t) => new Date(t.appointment_date) <= new Date(endDate)
      );
    }

    setFilteredTransactions(result);
  }, [filters, transactions]);

  // ▶ Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 🔹 Cập nhật trạng thái
  const handleStatusChange = async (t, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/transactions/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTransactions((prev) =>
        prev.map((tx) => (tx.id === t.id ? { ...tx, status: newStatus } : tx))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction status");
    }
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
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white fw-bold">
          💰 Manage Transactions
        </Card.Header>
        <Card.Body>
          {/* --- Bộ lọc --- */}
          <div className="bg-light p-3 rounded-3 shadow-sm mb-4">
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Customer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer..."
                    value={filters.customer}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, customer: e.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Lawyer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter lawyer..."
                    value={filters.lawyer}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, lawyer: e.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* --- Bảng giao dịch --- */}
          <Table bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Lawyer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((t, idx) => (
                  <tr key={t.id}>
                    <td>{indexOfFirst + idx + 1}</td>
                    <td>{t.customer_name}</td>
                    <td>{t.lawyer_name}</td>
                    <td>
                      {t.appointment_date
                        ? new Date(t.appointment_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>${t.amount?.toFixed(2) || "0.00"}</td>
                    <td>
                      <Badge
                        bg={
                          t.status === "Success"
                            ? "success"
                            : t.status === "Failed"
                            ? "danger"
                            : t.status === "Cancelled"
                            ? "secondary"
                            : "warning"
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        className="d-inline w-auto me-2"
                        value={t.status}
                        onChange={(e) => handleStatusChange(t, e.target.value)}
                        disabled={t.status === "Success"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                        <option value="Cancelled">Cancelled</option>
                      </Form.Select>

                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => {
                          setSelectedTransaction(t);
                          setShowModal(true);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* --- Pagination --- */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                {/* Previous */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                {/* Next */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </Card.Body>
      </Card>

      {/* 🔹 Modal chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <>
              <p>
                <strong>Customer:</strong> {selectedTransaction.customer_name}
              </p>
              <p>
                <strong>Lawyer:</strong> {selectedTransaction.lawyer_name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedTransaction.appointment_date
                  ? new Date(selectedTransaction.appointment_date).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> $
                {selectedTransaction.amount?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Status:</strong> {selectedTransaction.status}
              </p>
              {selectedTransaction.notes && (
                <p>
                  <strong>Notes:</strong> {selectedTransaction.notes}
                </p>
              )}
            </>
          ) : (
            <p>No transaction selected.</p>
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

export default ManageTransactionsPage;
