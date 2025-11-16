import { Navbar, Container, Row, Col } from "react-bootstrap";

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
            <span className="mx-2">User Agreement</span> •
            <span className="mx-2">Privacy Policy</span> •
            <span className="mx-2">Site Map</span>
          </div>

          <div className="text-muted">
            (775) 277-3705 | Careers
            <br />
            300 E 2nd St, Suite 1410, Reno, NV 89501
          </div>

          <p className="small text-muted mt-3 mb-0">
            © 2025 LegalEase. All rights reserved. All trademarks and logos are
            property of their respective owners. Technical support by LegalEase IT Team.
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
              <img
                src="images/bbb.png"
                alt="BBB Accredited"
                height="30"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* --- PHẦN DƯỚI --- */}
      <div className="footer-bottom text-light py-4 bg-dark">
        <Container>
          <Row className="align-items-center text-center">
            <Col>
              <p className="mb-0 small">
                Technical & Legal Support: LegalEase IT Team | © 2025 LegalEase. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
