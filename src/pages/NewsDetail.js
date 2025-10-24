import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import newsData from "../data/news.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewsDetail = () => {
  const { id } = useParams(); // 👈 lấy id trên URL (vd: /news/3)
  const navigate = useNavigate();

  // Tìm bài viết theo news_id
  const article = newsData.find((item) => item.news_id === parseInt(id));

  // Scroll lên đầu trang khi mở chi tiết
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Nếu không tìm thấy bài viết
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
        <Button
          variant="link"
          className="text-warning fw-semibold mb-4 text-decoration-none"
          onClick={() => navigate("/news")}
        >
          ← Back to News
        </Button>

        <h2 className="fw-bold mb-3">{article.title}</h2>
        <p className="text-muted small mb-4">
          Category: {article.category} | Views: {article.views}
        </p>

        <img
          src={article.thumbnail}
          alt={article.title}
          className="img-fluid rounded-4 shadow-sm mb-4"
          style={{ maxHeight: "450px", objectFit: "cover" }}
        />

        <p className="lead" style={{ textAlign: "justify" }}>
          {article.content}
        </p>
      </Container>
      <Footer />
    </>
  );
};

export default NewsDetail;
