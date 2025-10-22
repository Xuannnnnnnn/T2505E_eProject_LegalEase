import { Container, Row, Col } from "react-bootstrap";

const FindLawyerSection = () => {
  return (
    <section className="find-lawyer-section py-5">
      <Container>
        {/* --- PHẦN 1 --- */}
        <div className="text-center mb-5">
          <h2 className="fw-light">
            Don’t Just Find a Lawyer –{" "}
            <span className="fw-bold text-dark">Find the Right Lawyer</span>
          </h2>
        </div>

        <Row className="justify-content-center text-start mb-5">
          <Col md={6}>
            <p>
              When you need to <strong>find a lawyer</strong>, our no-cost system
              provides you with access to pre-screened lawyers through a quick and
              painless process. Immediately after you present your case, email
              notifications are sent to lawyers that match the geographic location
              and legal practice area you specify. Within 24 hours, your case is
              reviewed, evaluated, and when a lawyer is interested in taking your
              case, you'll receive a full attorney profile and their background
              information.
            </p>
          </Col>
          <Col md={6}>
            <p>
              We’ll also provide you with a full breakdown of their fee structure
              as well as user ratings by other LegalMatch clients to help you
              decide if they’re the right lawyer for you.
            </p>
            <p>
              Within a few hours after you submit your case, you may receive
              responses from local attorneys by phone or email. We recommend
              waiting a day or two to allow the majority of attorneys to review
              your case thoroughly. Then, it’s up to you to select the right
              lawyer near you based on the responses you receive and the legal
              qualifications you’re looking for.
            </p>
          </Col>
        </Row>

        {/* --- PHẦN 2 --- */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">
            Make Informed Decisions{" "}
            <span className="fw-light">in a No-Pressure Setting</span>
          </h3>
        </div>

        <Row className="justify-content-center">
          <Col md={8}>
            <ul className="list-unstyled text-start ms-3">
              <li className="mb-2">
                • Always 100% free to find and communicate with licensed attorneys – no hidden fees
              </li>
              <li className="mb-2">
                • Your privacy is always protected – you decide when to disclose your personal information to interested attorneys
              </li>
              <li className="mb-2">
                • All member lawyers are pre-screened and in good standing with their state’s bar associations
              </li>
              <li className="mb-2">
                • Review attorney’s profiles and responses to your case before making a decision
              </li>
              <li className="mb-2">
                • Know exactly how much each lawyer charges in detail
              </li>
              <li className="mb-2">
                • Lawyer star ratings and reviews show previous customer experiences and allow you to evaluate their strengths and weaknesses
              </li>
              <li className="mb-2">
                • Gain access to lawyers in every area of law
              </li>
              <li className="mb-2">
                • No random matching – you decide based on expertise, experience, pricing, and availability
              </li>
              <li className="mb-2">
                • There’s never any obligation to hire – you decide if and when to contact an attorney
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FindLawyerSection;
