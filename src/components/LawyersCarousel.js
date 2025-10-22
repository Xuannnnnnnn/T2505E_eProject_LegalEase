import { Container, Row, Col, Card } from "react-bootstrap";

export default function LawyersCarousel({ lawyers }) {
  return (
    <Container className="my-5">
      <Row className="g-4 justify-content-center">
        {lawyers.map((l, i) => (
          <Col md={3} sm={6} key={i} className="text-center">
            <Card className="border-0 shadow-sm p-3">
              <img
                src={l.img}
                alt={l.name}
                className="rounded-circle mb-2"
                width="96"
                height="96"
              />
              <Card.Body>
                <Card.Title>{l.name}</Card.Title>
                <Card.Text className="text-muted">{l.area}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

