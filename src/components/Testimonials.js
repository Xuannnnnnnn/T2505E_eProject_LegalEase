import React from "react";
import { Carousel, Container } from "react-bootstrap";

const testimonials = [
  {
    quote:
      "I've retained at least ten LegalEase cases so far, and I'd estimate that roughly half of my practice is a result of my connection to LegalEase.",
    author: "Roxanne M.",
    location: "Hanoi, Family Law Attorney",
  },
  {
    quote:
      "LegalEase has been instrumental in connecting me with clients that perfectly match my expertise.",
    author: "Nguyen T.",
    location: "Ho Chi Minh City, Immigration Lawyer",
  },
  {
    quote:
      "The quality of leads I get from LegalEase is consistently higher than from any other platform.",
    author: "Tran A.",
    location: "Da Nang, Business Law Attorney",
  },
  {
    quote:
      "Thanks to LegalEase, I've expanded my client base and increased visibility in my practice area.",
    author: "Le P.",
    location: "Hue, Corporate Law Attorney",
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="py-5 bg-white">
      <Container className="text-center">
        <h2 className="fw-semibold mb-5">
          What People Are Saying About{" "}
          <span className="text-primary">LegalEase</span>
        </h2>

        <Carousel
          fade
          indicators
          controls
          interval={5000}
          pause={false}
          className="testimonial-carousel w-75 mx-auto"
        >
          {testimonials.map((t, index) => (
            <Carousel.Item key={index}>
              <blockquote className="blockquote fs-5 fst-italic text-secondary mx-auto" style={{ maxWidth: "850px" }}>
                “{t.quote}”
              </blockquote>
              <footer className="blockquote-footer mt-3 fs-6 fw-semibold text-dark">
                — {t.author}, {t.location}
              </footer>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default TestimonialCarousel;
