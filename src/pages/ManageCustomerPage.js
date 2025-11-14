import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Period filter: week, month, year, custom
  const [period, setPeriod] = useState("month"); // DEFAULT = current month

  // Get date range functions
  const getCurrentWeek = () => {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1;
    const start = new Date(now.setDate(first));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };

  const getCurrentYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return { start, end };
  };

  // Auto-set date range when period changes
  useEffect(() => {
    let range = {};

    if (period === "week") range = getCurrentWeek();
    else if (period === "month") range = getCurrentMonth();
    else if (period === "year") range = getCurrentYear();
    else return; // custom → do not change manually entered dates

    setFilters((prev) => ({
      ...prev,
      startDate: range.start.toISOString().split("T")[0],
      endDate: range.end.toISOString().split("T")[0],
    }));
  }, [period]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/customers`);
        const data = await res.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...customers];
    const { name, email, status, startDate, endDate } = filters;

    // Name
    if (name) {
      results = results.filter((c) =>
        c.fullname.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Email
    if (email) {
      results = results.filter((c) =>
        c.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    // Status
    if (status) {
      results = results.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Date Range
    if (startDate) {
      results = results.filter(
        (c) => new Date(c.register_date) >= new Date(startDate)
      );
    }
    if (endDate) {
      results = results.filter(
        (c) => new Date(c.register_date) <= new Date(endDate)
      );
    }

    setFilteredCustomers(results);
  }, [filters, customers]);

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    await fetch(`${BASE_URL}/customers/${id}`, { method: "DELETE" });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // View details
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4 text-primary">Manage Customers</h3>

      {/* Filters */}
      <div className="bg-light p-3 rounded-3 shadow-sm mb-4">
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Period</Form.Label>
              <Form.Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">Current Week</option>
                <option value="month">Current Month</option>
                <option value="year">Current Year</option>
                <option value="custom">Custom</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name..."
                value={filters.name}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email..."
                value={filters.email || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => {
                  setPeriod("custom");
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }));
                }}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => {
                  setPeriod("custom");
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }));
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Register Date</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-muted">
                No matching customers found.
              </td>
            </tr>
          ) : (
            filteredCustomers.map((c, idx) => (
              <tr key={c.id}>
                <td>{idx + 1}</td>
                <td>{c.fullname}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>

                <td>
                  <Badge bg={c.status === "Active" ? "success" : "secondary"}>
                    {c.status}
                  </Badge>
                </td>

                <td>{c.register_date}</td>
                <td>{c.last_login}</td>

                <td>
                  <Button
                    size="sm"
                    variant="info"
                    className="me-2"
                    onClick={() => handleView(c)}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <p><strong>Name:</strong> {selectedCustomer.fullname}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
              <p><strong>Status:</strong> {selectedCustomer.status}</p>
              <p><strong>Register Date:</strong> {selectedCustomer.register_date}</p>
              <p><strong>Last Login:</strong> {selectedCustomer.last_login}</p>
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

export default ManageCustomerPage;
