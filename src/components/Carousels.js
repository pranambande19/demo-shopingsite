import React, { useState, useEffect } from "react";

const SwipeableCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const carouselItems = [
    {
      id: 1,
      caption: <div>Biggest Sale Coming Soon</div>,
    },
    {
      id: 2,
      caption: (
        <div>
          Flat 10% OFF <br />
          <span style={{ fontSize: "18px", fontWeight: "normal" }}>Use code SAVE10</span>
        </div>
      ),
    },
    {
      id: 3,
      caption: (
        <div>
          Flat 20% OFF <br />
          <span style={{ fontSize: "18px", fontWeight: "normal" }}>Use code SAVE20</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000); 

    return () => clearInterval(timer); 
  }, [carouselItems.length]);

  const handleSwipe = (startX, endX) => {
    if (startX - endX > 30) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    } else if (endX - startX > 30) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + carouselItems.length) % carouselItems.length
      );
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    handleSwipe(touchStart, touch.clientX);
  };

  const styles = {
    carouselContainer: {
      position: "relative",
      width: "100%", 
      height: "200px",
      margin: "0 auto",
      padding: "20px 0",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      color: "#fff",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      overflow: "hidden", 
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    caption: {
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
    },
    arrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(255, 255, 255, 0.8)",
      color: "#007bff",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "18px",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "background 0.3s",
    },
    leftArrow: {
      left: "10px",
    },
    rightArrow: {
      right: "10px",
    },
  };

  return (
    <div
      style={styles.carouselContainer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        style={{ ...styles.arrow, ...styles.leftArrow }}
        onClick={() =>
          setCurrentIndex(
            (prevIndex) =>
              (prevIndex - 1 + carouselItems.length) % carouselItems.length
          )
        }
      >
        &#8249; 
      </button>

     
      <div>
        <div style={styles.caption}>{carouselItems[currentIndex].caption}</div>
      </div>

      <button
        style={{ ...styles.arrow, ...styles.rightArrow }}
        onClick={() =>
          setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
        }
      >
        &#8250; 
      </button>
    </div>
  );
};

export default SwipeableCarousel;
