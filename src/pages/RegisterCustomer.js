import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function RegisterCustomer() {
  const primaryColor = '#17a2b8';

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 120px)', padding: '3rem 0', backgroundColor: '#f8f9fa' }}
      >
        <Card
          style={{
            width: '35rem',
            padding: '2rem 2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            borderRadius: '12px',
          }}
        >
          <Card.Body>
            <h4
              className="text-center mb-5 fw-bolder"
              style={{ color: primaryColor, letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              SIGN UP AS A CLIENT
            </h4>

            <Form>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Dùng để đăng nhập" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email dùng để đăng nhập" required />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="Ví dụ: Ho Chi Minh" />
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
