import { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập đăng nhập admin
    if (email.trim().toLowerCase() === "admin@gmail.com" && password === "Admin@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again!");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 shadow-lg rounded overflow-hidden" style={{ maxWidth: "900px" }}>
        {/* Cột trái: banner */}
        <Col
          md={6}
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: "linear-gradient(135deg, #007bff, #6610f2)",
            minHeight: "100%",
            padding: "40px",
          }}
        >
          <FaUserShield size={80} className="mb-4" />
          <h2 className="fw-bold text-center mb-3">The LegalEase System</h2>
          <p className="text-center" style={{ opacity: 0.9 }}>
            Powerful Admin Portal to manage lawyers, clients, and appointments efficiently —
            built for modern legal services.
          </p>
        </Col>

        {/* Cột phải: form đăng nhập */}
        <Col md={6} className="bg-white d-flex align-items-center justify-content-center p-4">
          <Card className="border-0 w-100" style={{ maxWidth: "400px" }}>
            <Card.Body>
              <div className="text-center mb-4">
                <FaUserShield size={50} color="#0d6efd" />
                <h3 className="mt-3 fw-semibold">Admin Login</h3>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && (
                  <p className="text-danger text-center mb-3 fw-medium">{error}</p>
                )}

                <div className="d-grid">
                  <Button variant="info" type="submit" size="lg">
                    Sign In
                  </Button>
                </div>
              </Form>

              <p className="text-center text-muted small mt-4 mb-0">
                © 2025 The LegalEase System. All rights reserved.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginAdmin;
