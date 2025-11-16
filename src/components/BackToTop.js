import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  // Hiển thị nút khi scroll xuống > 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary"
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            borderRadius: "50%",
            padding: "10px 12px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default BackToTop;
