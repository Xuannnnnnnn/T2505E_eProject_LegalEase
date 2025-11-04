import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Carousel, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/LawLibrary.css";

const BASE_URL = "http://localhost:3001"; // Đường dẫn đến db.json server

const LawLibrary = () => {
  const [newsData, setNewsData] = useState([]);
  const [visibleCount] = useState(4);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Lấy dữ liệu từ db.json
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/news`);
        const data = await res.json();
        // Lọc chỉ tin đã publish và active
        const activeNews = data
          .filter((n) => n.status === "Published" && n.is_active)
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        setNewsData(activeNews);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  // 👇 Khi click vào ảnh hoặc tiêu đề
  const handleReadMore = (news_id) => {
    navigate(`/news/${news_id}`);
  };

  // 🔹 Chia thành nhóm 4 bài mỗi slide
  const groupedNews = [];
  for (let i = 0; i < newsData.length; i += visibleCount) {
    groupedNews.push(newsData.slice(i, i + visibleCount));
  }

  // 🌀 Loading hiển thị trong lúc tải dữ liệu
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải dữ liệu pháp luật...</p>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h3 className="fw-bold mb-3">Legal Insights</h3>
          <p className="text-muted mx-auto" style={{ maxWidth: "900px" }}>
            At New & New Law Company Limited, we believe that legal knowledge is
            not only a tool that empowers you to communicate and negotiate with
            confidence, but also a solid foundation for making sound decisions
            in life and business. Through well-structured articles and in-depth
            analyses, we share practical legal insights — clearly presented,
            easy to understand, and applicable to everyday life.
          </p>
        </div>

        {groupedNews.length > 0 ? (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={false}
            interval={null}
            className="law-carousel"
          >
            {groupedNews.map((group, i) => (
              <Carousel.Item key={i}>
                <Row className="g-4 justify-content-center">
                  {group.map((article) => (
                    <Col key={article.news_id} md={6} lg={3}>
                      <Card className="h-100 border-0 rounded-4 shadow-sm">
                        {/* Ảnh click được */}
                        <div
                          className="ratio ratio-4x3 rounded-top-4 overflow-hidden"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleReadMore(article.news_id)}
                        >
                          <Card.Img
                            src={article.thumbnail}
                            alt={article.title}
                            className="object-fit-cover"
                          />
                        </div>

                        <Card.Body>
                          {/* Tiêu đề click được */}
                          <Card.Title
                            className="fs-6 fw-semibold text-start"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleReadMore(article.news_id)}
                          >
                            {article.title}
                          </Card.Title>
                          <Card.Text className="text-muted small text-start">
                            {article.excerpt}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p className="text-center text-muted">Không có bài viết nào để hiển thị.</p>
        )}

        <div className="text-center mt-4">
          <Button variant="warning" onClick={() => navigate("/news")}>
            LEARN MORE
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default LawLibrary;
