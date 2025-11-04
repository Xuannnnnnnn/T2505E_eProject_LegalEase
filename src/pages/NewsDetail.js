import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "http://localhost:3001";

const NewsDetail = () => {
  const { id } = useParams(); // id trên URL (vd /news/3)
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${BASE_URL}/news`);
        if (!res.ok) throw new Error("Failed to load articles");
        const data = await res.json();

        // 🔍 Tìm theo news_id (vì db.json không có id)
        const found = data.find((n) => Number(n.news_id) === Number(id));
        setArticle(found || null);
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
        <Button
          variant="link"
          className="text-warning fw-semibold mb-4 text-decoration-none"
          onClick={() => navigate("/news")}
        >
          ← Back to News
        </Button>

        <h2 className="fw-bold mb-3">{article.title}</h2>

        <p className="text-muted small mb-4">
          Category: {article.category || "General"} | Views: {article.views || 0}
        </p>

        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="img-fluid rounded-4 shadow-sm mb-4"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
        )}

        <p
          className="lead"
          style={{ textAlign: "justify", whiteSpace: "pre-line" }}
        >
          {article.content}
        </p>
      </Container>
      <Footer />
    </>
  );
};

export default NewsDetail;
