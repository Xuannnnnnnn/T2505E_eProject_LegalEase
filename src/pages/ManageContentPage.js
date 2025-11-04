import React, { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Modal, Form, Spinner, Row, Col } from "react-bootstrap";

const BASE_URL = "http://localhost:3001";

const ManageContentPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/news`);
        const data = await res.json();
        setNewsList(data);
        setFilteredNews(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Apply filters
  const handleFilter = () => {
    let filtered = [...newsList];
    if (searchTitle) {
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter((n) => n.category === filterCategory);
    }
    if (filterStatus) {
      filtered = filtered.filter((n) => n.status === filterStatus);
    }
    if (filterStartDate) {
      filtered = filtered.filter(
        (n) => new Date(n.created_at) >= new Date(filterStartDate)
      );
    }
    if (filterEndDate) {
      filtered = filtered.filter(
        (n) => new Date(n.created_at) <= new Date(filterEndDate)
      );
    }
    setFilteredNews(filtered);
  };

  const handleView = (news) => {
    setSelectedNews(news);
    setShowModal(true);
    setEditMode(false);
  };

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/news/${selectedNews.news_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedNews),
      });
      if (res.ok) {
        setNewsList((prev) =>
          prev.map((n) =>
            n.news_id === selectedNews.news_id ? selectedNews : n
          )
        );
        handleFilter(); // refresh filtered list
        alert("Changes saved!");
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch(`${BASE_URL}/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNewsList((prev) => prev.filter((n) => n.news_id !== id));
        setFilteredNews((prev) => prev.filter((n) => n.news_id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete news!");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  // Extract unique categories for dropdown
  const categories = [...new Set(newsList.map((n) => n.category))];

  return (
    <Container className="p-4">
      <h2 className="mb-4 text-primary fw-bold">📄 Manage News & Content</h2>

      {/* --- Filters --- */}
      <div className="bg-light p-3 rounded mb-4">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Search Title</Form.Label>
              <Form.Control
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Enter title"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button variant="primary" onClick={handleFilter}>
            🔍 Apply Filters
          </Button>
        </div>
      </div>

      {/* --- Table --- */}
      <Table striped bordered hover responsive>
        <thead className="table-info text-center">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Views</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {filteredNews.length > 0 ? (
            filteredNews.map((n) => (
              <tr key={n.news_id}>
                <td>{n.news_id}</td>
                <td>{n.title}</td>
                <td>{n.category}</td>
                <td>
                  <Badge bg={n.status === "Published" ? "success" : "secondary"}>
                    {n.status}
                  </Badge>
                </td>
                <td>{n.views}</td>
                <td>{new Date(n.created_at).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(n)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(n.news_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No news found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* --- Modal --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>News Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={!editMode}
                  value={selectedNews.title}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  readOnly={!editMode}
                  value={selectedNews.excerpt}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, excerpt: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  readOnly={!editMode}
                  value={selectedNews.content}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, content: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={!editMode}
                  value={selectedNews.category}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, category: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  disabled={!editMode}
                  value={selectedNews.status}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, status: e.target.value })
                  }
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thumbnail</Form.Label>
                <div className="mb-2">
                  <img
                    src={selectedNews.thumbnail}
                    alt={selectedNews.title}
                    style={{ width: "150px", borderRadius: "5px" }}
                  />
                </div>
                {editMode && (
                  <Form.Control
                    type="text"
                    value={selectedNews.thumbnail}
                    onChange={(e) =>
                      setSelectedNews({ ...selectedNews, thumbnail: e.target.value })
                    }
                  />
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Other Info</Form.Label>
                <Form.Control
                  type="text"
                  readOnly={!editMode}
                  value={selectedNews.other}
                  onChange={(e) =>
                    setSelectedNews({ ...selectedNews, other: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button variant="success" onClick={handleSave}>
              💾 Save
            </Button>
          ) : (
            <Button variant="warning" onClick={handleEdit}>
              ✏️ Edit
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageContentPage;
