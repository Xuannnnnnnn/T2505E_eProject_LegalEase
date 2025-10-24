import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import specializationData from "../data/specializations.json"; // 👈 nhớ có file JSON này trong /src/data/

function RegisterLawyer() {
  const primaryColor = "#17a2b8";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    experience_years: "",
    successful_cases: "",
    specialization: "",
    city: "",
  });

  const [validated, setValidated] = useState(false);

  // ✅ Khi nhấn submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // ✅ Tính rating tạm thời dựa vào số năm kinh nghiệm và tỉ lệ vụ thành công
    const exp = parseInt(formData.experience_years || 0);
    const success = parseInt(formData.successful_cases || 0);
    const rating = Math.min(5, Math.round((exp * 0.3 + success * 0.05) * 10) / 10);

    const newLawyer = {
      ...formData,
      rating,
      id: Date.now(),
    };

    // ✅ Lưu vào localStorage
    const existing = JSON.parse(localStorage.getItem("lawyers")) || [];
    existing.push(newLawyer);
    localStorage.setItem("lawyers", JSON.stringify(existing));

    alert("✅ Lawyer registered successfully!");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 120px)", padding: "3rem 0", backgroundColor: "#f8f9fa" }}
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
              className="text-center mb-5 fw-bolder"
              style={{ color: primaryColor, letterSpacing: "1px", textTransform: "uppercase" }}
            >
              SIGN UP AS A LAWYER
            </h4>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your full name"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Used for login"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Ho Chi Minh"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formExperience">
                    <Form.Label>Years of Experience</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      required
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({ ...formData, experience_years: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formSuccess">
                    <Form.Label>Successful Cases</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      required
                      value={formData.successful_cases}
                      onChange={(e) =>
                        setFormData({ ...formData, successful_cases: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formSpecialization">
                <Form.Label>Specialization</Form.Label>
                <Form.Select
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                >
                  <option value="">Select specialization...</option>
                  {specializationData.map((spec, index) => (
                    <option key={index} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-grid gap-2 mb-3">
                <Button variant="info" type="submit" className="py-2 text-uppercase fw-bold">
                  Register Now
                </Button>
              </div>

              <p className="text-center text-muted" style={{ fontSize: "0.9rem" }}>
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

export default RegisterLawyer;
