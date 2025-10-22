import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Breadcrumb } from "react-bootstrap";
import newsData from "../data/news.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Tìm bài hiện tại
    const article = newsData.find((n) => n.id === parseInt(id));

    if (!article) {
        return (
            <Container className="py-5 text-center">
                <h3>Article not found</h3>
                <Button variant="warning" onClick={() => navigate("/news")}>
                    Back to News
                </Button>
            </Container>
        );
    }

    // Lọc các bài liên quan (khác id hiện tại)
    const relatedArticles = newsData
        .filter((n) => n.id !== article.id)
        .slice(0, 3);

    return (
        <>
        <Header/>
        <Container className="py-5">
            {/* ✅ Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                    Home
                </Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/news" }}>
                    News
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{article.title}</Breadcrumb.Item>
            </Breadcrumb>

            {/* ✅ Nội dung bài viết */}

            <h2 className="fw-bold mb-3">{article.title}</h2>
            {/* Nếu có date thì hiển thị, còn không thì ẩn */}
            {article.date && <p className="text-muted">{article.date}</p>}
            <img
                src={article.image}
                alt={article.title}
                className="img-fluid rounded mb-4 shadow-sm"
                style={{ maxHeight: "450px", objectFit: "cover" }}
            />
            {/* Hiển thị nội dung chính */}
            <p className="lead text-justify">{article.content}</p>
            <Button variant="outline-warning mb-4" onClick={() => navigate("/news")}>
                ← Back to News
            </Button>
            {/* ✅ Related Articles */}
            <div className="mt-5">
                <h4 className="fw-semibold mb-4 border-bottom pb-2">Related Articles</h4>
                <Row className="g-4">
                    {relatedArticles.map((news) => (
                        <Col key={news.id} md={6} lg={4}>
                            <Card
                                className="h-100 border-0 shadow-sm hover-shadow-sm"
                                onClick={() => navigate(`/news/${news.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="ratio ratio-4x3 overflow-hidden">
                                    <Card.Img
                                        src={news.image}
                                        alt={news.title}
                                        className="object-fit-cover"
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title className="fs-6 fw-semibold">
                                        {news.title}
                                    </Card.Title>
                                    <Card.Text className="text-muted small">
                                        {news.date}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
        <Footer/>
        </>
    );
};

export default NewsDetail;
