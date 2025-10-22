import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Register() {
  const primaryColor = '#17a2b8'; 
  const secondaryColor = '#6c757d'; 

  return (
    <>
      <Header />
      
      <Container className="d-flex justify-content-center align-items-center" 
                 style={{ minHeight: 'calc(100vh - 120px)', padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        
        <Card style={{ 
          width: '35rem', 
          padding: '2rem 2.5rem', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
          borderRadius: '12px' 
        }}>
          <Card.Body>
            <h4 className="text-center mb-5 fw-bolder" 
                style={{ color: primaryColor, letterSpacing: '1px', textTransform: 'uppercase' }}>
              SIGN UP AS A CLIENT
            </h4> 

            <Form>
              <Row className="mb-2">
                {/* 1. Tên Tài Khoản (Username) - Bắt buộc */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Username</Form.Label>
                    <Form.Control type="text" size="md" placeholder="Dùng để đăng nhập" required />
                  </Form.Group>
                </Col>
                
                {/* 2. Mật Khẩu (Password) - Bắt buộc */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Password</Form.Label>
                    <Form.Control type="password" size="md" required />
                  </Form.Group>
                </Col>
              </Row>

              {/* 3. Email - Dùng làm phương thức đăng nhập thay thế */}
              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Email Address</Form.Label>
                <Form.Control type="email" size="md" placeholder="Email dùng để đăng nhập hoặc khôi phục mật khẩu" required />
              </Form.Group>


              <Row className="mb-2">
                {/* Full Name */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Full Name</Form.Label>
                    <Form.Control type="text" size="md" />
                  </Form.Group>
                </Col>
                {/* City (Thành phố/Tỉnh) */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCity">
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.85rem' }}>City</Form.Label>
                    <Form.Control type="text" size="md" placeholder="Ví dụ: Ho Chi Minh" />
                  </Form.Group>
                </Col>
              </Row>
              
              <p className="text-muted text-end" style={{fontSize: '0.8rem'}}>Not located in the Vietnam?</p>

              {/* Radio Buttons */}
              <div className="p-3 mb-4 mt-3 rounded border" style={{ backgroundColor: '#ffffff', borderColor: '#e9ecef' }}>
                  <Row>
                      <Col md={6}>
                          <Form.Check 
                              type="radio" 
                              label={<span className='fw-bold' style={{color: secondaryColor}}>I'm a Lawyer</span>}
                              name="userType" 
                              id="radioLuatSu" 
                              className="mb-1"
                          />
                          <small className="text-muted ms-4" style={{fontSize: '0.75rem'}}>Actively Barred & in Good Standing</small>
                      </Col>
                      <Col md={6}>
                          <Form.Check 
                              type="radio" 
                              label={<span className='fw-bold' style={{color: primaryColor}}>I'm a Client</span>}
                              name="userType" 
                              id="radioKhachHang" 
                              className="mb-1"
                              defaultChecked 
                          />
                          <small className="text-muted ms-4" style={{fontSize: '0.75rem'}}>Seeking Business Legal Services</small>
                      </Col>
                  </Row>
              </div>
              
              {/* ReCAPTCHA placeholder */}
              <div 
                  className="mb-4 border p-3 mx-auto" 
                  style={{ maxWidth: '300px', backgroundColor: '#ffffff', borderColor: '#ced4da' }}
              >
                  <Form.Check type="checkbox" label="Tôi không phải là người máy" />
                  <div className="mt-2 text-end">
                      <small className="text-muted" style={{fontSize: '0.75rem'}}>reCAPTCHA | 
                          <a href="#" style={{color: primaryColor}}> Bảo mật </a> | 
                          <a href="#" style={{color: primaryColor}}> Điều khoản</a>
                      </small>
                  </div>
              </div>

              {/* Register Button */}
              <div className="d-grid gap-2 mb-3">
                <Button 
                  variant="info" 
                  type="submit" 
                  size="lg" 
                  className="py-2 text-uppercase"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor, fontWeight: 'bolder', fontSize: '1.1rem' }}
                >
                  SIGN UP NOW
                </Button>
              </div>
              
              {/* Điều khoản sử dụng */}
              <p className="text-center text-muted" style={{fontSize: '0.75rem'}}>
                  By clicking on "Sign Up Now", I agree to and understand the LegalEase 
                  <a href="#" className="fw-bold" style={{ color: primaryColor }}> Terms of Use </a> 
                  &
                  <a href="#" className="fw-bold" style={{ color: primaryColor }}> Privacy Policy.</a>
              </p>

            </Form>

            <div className="mb-4 mt-4" style={{ borderBottom: '1px solid #e0e0e0' }}></div>
            
            {/* Login Link (Link Đăng nhập) */}
            <div className="text-center">
              <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>Already have an account?</p>
              <Link to="/login" className="fw-bolder" 
                    style={{ color: primaryColor, textDecoration: 'none', fontSize: '1.1rem' }}>
                LOGIN NOW ➡️
              </Link>
            </div>

          </Card.Body>
        </Card>
      </Container>
      
      <Footer />
    </>
  );
}

export default Register;