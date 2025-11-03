import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function RegisterCustomer() {
  const primaryColor = '#17a2b8';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password_hash: '',
    fullname: '',
    phone: '',
    address: '',
    dob: '',
    gender: 'Male',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id.replace('form', '').toLowerCase()]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCustomer = {
      ...formData,
      register_date: new Date().toISOString().split('T')[0],
      last_login: '',
      status: 'Inactive',
      other: '',
    };

    try {
      const response = await fetch('http://localhost:3001/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        alert('Đăng ký thành công!');
        navigate('/login');
      } else {
        alert('Lỗi khi đăng ký!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể kết nối đến server.');
    }
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 120px)', padding: '3rem 0', backgroundColor: '#f8f9fa' }}
      >
        <Card
          style={{
            width: '40rem',
            padding: '2rem 2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            borderRadius: '12px',
          }}
        >
          <Card.Body>
            <h4
              className="text-center mb-4 fw-bolder"
              style={{ color: primaryColor, letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              Sign Up as a Client
            </h4>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email dùng để đăng nhập" required onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword_hash">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFullname">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="formDob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select onChange={handleChange}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2 mb-3">
                <Button variant="info" type="submit" className="py-2 text-uppercase fw-bold">
                  Sign Up Now
                </Button>
              </div>

              <p className="text-center text-muted" style={{ fontSize: '0.9rem' }}>
                Already have an account?{' '}
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
