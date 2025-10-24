import React, { useState } from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const clientSteps = [
  {
    id: 1,
    title: "Post Your Case",
    desc: "It's free and easy; interested attorneys will send you responses.",
    img: "https://cdn-icons-png.flaticon.com/512/3197/3197961.png",
  },
  {
    id: 2,
    title: "Review Responses",
    desc: "Compare fees, ratings and background information.",
    img: "https://cdn-icons-png.flaticon.com/512/892/892781.png",
  },
  {
    id: 3,
    title: "Choose an Attorney",
    desc: "Meet for initial consultations and decide who is right for you.",
    img: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  },
];

const attorneySteps = [
  {
    id: 1,
    title: "Become a Member",
    desc: "Sign up to become a LegalEase member. Gain access to local clients in need of your legal services.",
    img: "https://cdn-icons-png.flaticon.com/512/1055/1055646.png",
  },
  {
    id: 2,
    title: "We Market Your Practice",
    desc: "Save yourself time and money. Let us expand your opportunities and increase your visibility.",
    img: "https://cdn-icons-png.flaticon.com/512/1828/1828817.png",
  },
  {
    id: 3,
    title: "Choose Your Clients",
    desc: "Evaluate a steady stream of cases. Contact potential clients instantly for your most lucrative practice areas!",
    img: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
  },
];

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("clients");

  const steps = activeTab === "clients" ? clientSteps : attorneySteps;

  return (
    <section className="py-5 bg-light">
      <Container>
        {/* Tabs Header */}
        <div className="d-flex justify-content-center mb-4">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "clients"}
                onClick={() => setActiveTab("clients")}
                className="fw-semibold fs-2"
              >
                How It Works
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "attorneys"}
                onClick={() => setActiveTab("attorneys")}
                className="fw-semibold fs-2"
              >
                How It Works - Attorneys
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Tab content */}
        <Row className="mt-4">
          {steps.map((s) => (
            <Col md={4} key={s.id} className="text-center mb-4">
              <img
                src={s.img}
                alt={s.title}
                width="70"
                className="mb-3 opacity-75"
              />
              <h5 className="fw-semibold text-primary">
                {s.id}. {s.title}
              </h5>
              <p className="text-muted">{s.desc}</p>
            </Col>
          ))}
        </Row>

        {/* Nút đăng ký dành cho Attorneys */}
        {activeTab === "attorneys" && (
          <div className="text-center mt-3">
            <Link to="/registerlawyer" style={{ textDecoration: 'none' }}>
              <Button
                style={{ backgroundColor: '#FFC600', borderColor: '#FFC600', color: '#0c0c0cff' }}
                className="fw-semibold px-4 py-2 shadow-sm"
              >
                Register
              </Button>
            </Link>

          </div>
        )}
      </Container>
    </section>
  );
};

export default HowItWorks;
