import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RegisterCustomer() {
  const primaryColor = "#17a2b8";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password_hash: "",
    fullname: "",
    phone: "",
    address: "",
    dob: "",
    gender: "Male",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCustomer = {
      ...formData,
      register_date: new Date().toISOString().split("T")[0],
      last_login: "",
      status: "Inactive",
      other: "",
    };

    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert("Lỗi khi đăng ký!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối đến server.");
    }
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 120px)",
          padding: "3rem 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card
          style={{
            width: "40rem",
            padding: "2rem 2.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            borderRadius: "12px",
          }}
        >
          <Card.Body>
            <h4
              className="text-center mb-4 fw-bolder"
              style={{
                color: primaryColor,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Sign Up as a Client
            </h4>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email dùng để đăng nhập"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="password_hash">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_hash"
                      value={formData.password_hash}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="fullname">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3" controlId="dob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2 mb-3">
                <Button
                  variant="info"
                  type="submit"
                  className="py-2 text-uppercase fw-bold"
                >
                  Sign Up Now
                </Button>
              </div>

              <p
                className="text-center text-muted"
                style={{ fontSize: "0.9rem" }}
              >
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-info">
                  Login now
                </Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default RegisterCustomer;
