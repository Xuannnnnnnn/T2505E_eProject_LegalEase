import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "http://localhost:3001";

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Lấy dữ liệu từ db.json
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/news`);
        const data = await res.json();

        // Lọc tin hợp lệ (đã publish & active)
        const validNews = data
          .filter((n) => n.status === "Published" && n.is_active)
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        setNewsData(validNews);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Hàm xử lý khi click vào bài viết hoặc nút "Read more"
  const handleReadMore = (news_id) => {
    navigate(`/news/${news_id}`);
  };

  return (
    <>
      <Header />

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">
            Latest Legal News & Insights
          </h2>

          {/* Hiển thị khi đang tải */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Đang tải tin tức...</p>
            </div>
          ) : newsData.length > 0 ? (
            <Row className="g-4">
              {newsData.map((news) => (
                <Col key={news.news_id} md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow-sm">
                    {/* Ảnh bài viết */}
                    <div
                      className="rounded-top-4 overflow-hidden"
                      style={{
                        cursor: "pointer",
                        aspectRatio: "4 / 3",
                      }}
                      onClick={() => handleReadMore(news.news_id)}
                    >
                      <Card.Img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>

                    <Card.Body>
                      {/* Tiêu đề */}
                      <Card.Title
                        className="fs-5 fw-semibold"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleReadMore(news.news_id)}
                      >
                        {news.title}
                      </Card.Title>

                      {/* Mô tả ngắn */}
                      <Card.Text className="text-muted small">
                        {news.excerpt}
                      </Card.Text>

                      {/* Nút Read more */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadMore(news.news_id);
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
          ) : (
            <p className="text-center text-muted">
              Không có bài viết nào được hiển thị.
            </p>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default NewsPage;
