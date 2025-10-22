import { Navbar, Container, Row, Col, Button } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYelp } from "react-icons/fa";

// 🖼 import ảnh BBB logo từ thư mục images
const Footer = () => {
  return (
    <footer className="footer-section mt-5">
      {/* --- PHẦN TRÊN --- */}
      <div className="footer-top text-center py-4">
        <Container>
          <Navbar.Brand
            href="#"
            className="fw-bold d-flex align-items-center justify-content-center"
            style={{ fontSize: "1.4rem", color: "#1a237e" }}
          >
            ⚖️ <span className="ms-1 text-warning">Legal</span>
            <span style={{ color: "#1a237e" }}>Ease</span>
          </Navbar.Brand>

          <div className="footer-links small text-muted mb-2">
            <a href="#!" className="text-decoration-none mx-2 text-dark">
              User Agreement
            </a>{" "}
            •
            <a href="#!" className="text-decoration-none mx-2 text-dark">
              Privacy Policy
            </a>{" "}
            •
            <a href="#!" className="text-decoration-none mx-2 text-dark">
              Site Map
            </a>
          </div>

          <div className="text-muted">
            (775) 277-3705 | Careers
            <br />
            300 E 2nd St, Suite 1410, Reno, NV 89501
          </div>

          <p className="small text-muted mt-3 mb-0">
            © 2025 LegalEase. All rights reserved.
          </p>
        </Container>
      </div>

      {/* --- PHẦN SỐ LIỆU --- */}
      <div className="footer-stats py-4 bg-light text-center">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-0">
                OVER <span className="text-primary">7 MILLION</span>
              </h2>
              <p className="text-muted mb-0">CASES POSTED</p>
            </Col>
            <Col md={4}>
              <img src="images/bbb.png" alt="BBB Accredited" height="30" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* --- PHẦN DƯỚI --- */}
      <div className="footer-bottom text-light py-4 bg-dark">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-md-start text-center mb-3 mb-md-0">
              <h6 className="fw-bold mb-3">ATTORNEYS:</h6>
              <Button variant="light" size="sm" className="me-2">
                SIGN UP
              </Button>
              <Button variant="light" size="sm" className="me-2">
                MARKET YOUR BUSINESS
              </Button>
              <Button variant="light" size="sm">
                LOG IN
              </Button>
            </Col>

            <Col md={6} className="text-md-end text-center">
              <p className="mb-2 small text-uppercase">
                Share the LegalEase experience:
              </p>
              <div className="d-flex justify-content-md-end justify-content-center gap-3 fs-5">
                <a href="#!" className="text-light">
                  <FaFacebookF />
                </a>
                <a href="#!" className="text-light">
                  <FaYelp />
                </a>
                <a href="#!" className="text-light">
                  <FaTwitter />
                </a>
                <a href="#!" className="text-light">
                  <FaLinkedinIn />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
