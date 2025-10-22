import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
import newsData from "../data/news.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewPages = () => {
  const navigate = useNavigate(); // 👈 khởi tạo hook để chuyển trang

  // Hàm xử lý khi click vào bài viết hoặc nút "Read more"
  const handleReadMore = (id) => {
    navigate(`/news/${id}`); // 👈 chuyển hướng sang trang chi tiết
  };

  return (
    <>
      <Header />

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Latest Legal News & Insights</h2>

          <Row className="g-4">
            {newsData.map((news) => (
              <Col key={news.id} md={6} lg={4}>
                <Card
                  className="h-100 border-0 shadow-sm rounded-4 hover-shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleReadMore(news.id)} // 👈 click vào card cũng đi
                >
                  <div className="ratio ratio-4x3 rounded-top-4 overflow-hidden">
                    <Card.Img
                      src={news.image}
                      alt={news.title}
                      className="object-fit-cover"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fs-5 fw-semibold">
                      {news.title}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {news.excerpt}
                    </Card.Text>

                    {/* 👇 Nút Read more */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // tránh trùng click với Card
                        handleReadMore(news.id);
                      }}
                      className="btn btn-link text-warning fw-semibold text-decoration-none p-0"
                    >
                      Read more →
                    </button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default NewPages;
