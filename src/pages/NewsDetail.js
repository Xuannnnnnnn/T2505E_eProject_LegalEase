import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Spinner,
  Badge,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReactMarkdown from "react-markdown";

const BASE_URL = "http://localhost:3001";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${BASE_URL}/news`);
        if (!res.ok) throw new Error("Failed to load articles");
        const data = await res.json();

        // Tìm bài hiện tại
        const found = data.find((n) => Number(n.news_id) === Number(id));
        setArticle(found || null);

        // Lấy các bài liên quan (cùng category nhưng khác id)
        if (found) {
          const relatedNews = data.filter(
            (n) => n.category === found.category && n.news_id !== found.news_id
          );
          setRelated(relatedNews);
        }
      } catch (err) {
        console.error("❌ Error loading article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading article...</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center">
          <h3 className="text-danger fw-bold">Article not found</h3>
          <Button variant="warning" onClick={() => navigate("/news")}>
            Back to News
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        {/* Nút Back */}
        <Button
          variant="link"
          className="text-warning fw-semibold mb-4 text-decoration-none"
          onClick={() => navigate("/news")}
        >
          ← Back to News
        </Button>

        {/* Tiêu đề */}
        <h1 className="fw-bold mb-3">{article.title}</h1>

        {/* Category và Views */}
        <div className="mb-4">
          <Badge bg="secondary" className="me-2">
            {article.category || "General"}
          </Badge>
          <span className="text-muted">Views: {article.views || 0}</span>
        </div>

        {/* Ảnh thumbnail */}
        {article.thumbnail && (
          <div className="text-center mb-4">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="img-fluid rounded-4 shadow-sm"
              style={{
                maxHeight: "450px",
                objectFit: "cover",
                width: "100%",
              }}
            />
          </div>
        )}

        {/* Nội dung Markdown */}
        <div
          className="article-content"
          style={{ lineHeight: "1.8", fontSize: "1.05rem" }}
        >
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Ảnh bổ sung */}
        {article.images && article.images.length > 0 && (
          <div className="mt-4">
            {article.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`img-${idx}`}
                className="img-fluid rounded-4 shadow-sm mb-3"
                style={{
                  maxHeight: "400px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            ))}
          </div>
        )}

        {/* Related News */}
        {related.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Related News</h4>
            <Row>
              {related.map((item) => (
                <Col md={6} lg={3} key={item.news_id} className="mb-3">
                  <Card
                    className="h-100 cursor-pointer"
                    onClick={() => navigate(`/news/${item.news_id}`)}
                  >
                    {item.thumbnail && (
                      <Card.Img
                        variant="top"
                        src={item.thumbnail}
                        style={{ maxHeight: "150px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title style={{ fontSize: "1rem" }}>
                        {item.title.length > 50
                          ? item.title.substring(0, 50) + "..."
                          : item.title}
                      </Card.Title>
                      <div className="mt-2">
                        <Badge
                          bg="secondary"
                          className="me-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {item.category || "General"}
                        </Badge>
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Views: {item.views || 0}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Nút Back dưới cùng */}
        <div className="mt-4">
          <Button variant="warning" onClick={() => navigate("/news")}>
            ← Back to News
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default NewsDetail;
