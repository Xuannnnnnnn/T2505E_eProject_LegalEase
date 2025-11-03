import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import specializationData from "../data/specializations.json";

function RegisterLawyer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:3001";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password_hash: "",
    dob: "",
    gender: "Male",
    phone: "",
    address: "",
    city: "",
    experience_years: "",
    cases_handled: "",
    specialization: "",
    hourly_rate: "",
    profile_summary: "",
    image: null,
    degree_file: null,
    license_file: null,
    certificates: null
  });

  // Convert file to Base64
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        [key]: { name: file.name, type: file.type, data: reader.result },
      });
    };
    reader.readAsDataURL(file);
  };

  // Convert image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result }); // Lưu Base64 string
    };
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newLawyer = {
      ...formData,
      lawyer_id: Date.now(),
      rating: 0,
      verify_status: false,
      approve_by: null,
      approve_at: null,
      register_date: new Date().toISOString(),
      status: "Pending",
    };

    try {
      const res = await fetch(`${BASE_URL}/lawyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLawyer),
      });

      if (res.ok) {
        alert("Registration successful! Please wait for admin approval.");
        navigate("/login");
      } else {
        alert("Error while registering lawyer!");
      }
    } catch (err) {
      alert("Cannot connect to server!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 120px)",
          background: "#f8f9fa",
          padding: "2rem",
        }}
      >
        <Card
          style={{
            width: "45rem",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body>
            <h3 className="text-center text-info fw-bold mb-4">
              Lawyer Registration
            </h3>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password_hash}
                  onChange={(e) =>
                    setFormData({ ...formData, password_hash: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                >
                  <option value="">-- Select specialization --</option>
                  {specializationData.map((s, i) => (
                    <option key={i} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Degree File</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleFileChange(e, "degree_file")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>License File</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleFileChange(e, "license_file")}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Certificates</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleFileChange(e, "certificates")}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid">
                <Button variant="info" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Register Now"}
                </Button>
              </div>

              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
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
