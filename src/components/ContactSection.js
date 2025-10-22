import React from "react";
import { Container, Button } from "react-bootstrap";

const ContactSection = () => (
  <section className="text-center py-5">
    <Container>
      <h4>Contact Lawyers at Your Convenience</h4>
      <p className="text-muted">
        Submit your case at any time to find a lawyer or attorney near you.
      </p>
      <Button variant="primary">Find Your Lawyer Now</Button>
    </Container>
  </section>
);

export default ContactSection;
