import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import newsData from "../data/news.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewsPage = () => {
  const navigate = useNavigate();

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
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default NewsPage;
