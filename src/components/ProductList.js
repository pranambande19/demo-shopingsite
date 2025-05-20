import React, { useState, useEffect, useMemo, useCallback } from "react";
import products from "./products.json";

const ProductList = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortOption, setSortOption] = useState("default");
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Memoized function to filter, sort, and group products
  const processProducts = useCallback(() => {
    let filteredProducts = [...products].filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      const price = parseInt(product.selling_price.replace(/,/g, "")) || 0;
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;
      const matchesCategory =
        filterOption === "all" ||
        (filterOption === "discounted" && product.discount) ||
        (filterOption === "inStock" && !product.out_of_stock);
      return matchesSearch && matchesPrice && matchesCategory;
    });

    // Sort products
    switch (sortOption) {
      case "priceLowHigh":
        filteredProducts.sort((a, b) =>
          (parseInt(a.selling_price.replace(/,/g, "")) || 0) -
          (parseInt(b.selling_price.replace(/,/g, "")) || 0)
        );
        break;
      case "priceHighLow":
        filteredProducts.sort((a, b) =>
          (parseInt(b.selling_price.replace(/,/g, "")) || 0) -
          (parseInt(a.selling_price.replace(/,/g, "")) || 0)
        );
        break;
      case "rating":
        filteredProducts.sort((a, b) =>
          (parseFloat(b.average_rating) || 0) - (parseFloat(a.average_rating) || 0)
        );
        break;
      default:
        break;
    }

    // Group by pattern
    const groupedByPattern = {};
    filteredProducts.forEach((product) => {
      const pattern =
        product.product_details?.find((detail) => detail.Pattern)?.Pattern || "Other";
      if (!groupedByPattern[pattern]) {
        groupedByPattern[pattern] = [];
      }
      groupedByPattern[pattern].push(product);
    });

    return groupedByPattern;
  }, [debouncedSearchTerm, filterOption, priceRange, sortOption]);

  // Use memoization to avoid recalculating on every render
  const groupedProducts = useMemo(() => processProducts(), [processProducts]);

  const calculateOriginalPrice = (sellingPrice, discount) => {
    if (!discount) return sellingPrice;
    const discountPercentage = parseInt(discount) || 0;
    const price = parseInt(sellingPrice.replace(/,/g, "")) || 0;
    return discountPercentage > 0 ? ((price * 100) / (100 - discountPercentage)).toFixed(0) : sellingPrice;
  };

  const renderProductCard = (product) => (
    <div
      key={product._id}
      style={styles.productCard}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={styles.imageContainer}>
        {product.out_of_stock && <span style={styles.outOfStock}>Out of Stock</span>}
        <img
          src={product.images?.[0] || "https://via.placeholder.com/150?text=No+Image"}
          alt={product.title || "Product"}
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150?text=No+Image";
          }}
        />
      </div>
      <div style={styles.productInfo}>
        <h3 style={styles.title}>{product.title || "No Title"}</h3>
        <p style={styles.brand}>Brand: {product.brand || "Unknown"}</p>
        <div style={styles.ratingContainer}>
          <span style={styles.ratingBadge}>★ {product.average_rating || 0}</span>
        </div>
        <div style={styles.priceContainer}>
          <p style={styles.price}>₹{product.selling_price || "0"}</p>
          {product.discount && (
            <>
              <p style={styles.originalPrice}>
                ₹{calculateOriginalPrice(product.selling_price, product.discount)}
              </p>
              <p style={styles.discount}>{product.discount || "0%"}</p>
            </>
          )}
        </div>
        <button
          style={{
            ...styles.button,
            opacity: product.out_of_stock ? 0.5 : 1,
            cursor: product.out_of_stock ? "not-allowed" : "pointer",
          }}
          onClick={() => !product.out_of_stock && addToCart(product)}
          disabled={product.out_of_stock}
        >
          {product.out_of_stock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Filters</h3>
        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterSection}>
          <h4>Sort By</h4>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={styles.select}
          >
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div style={styles.filterSection}>
          <h4>Price Range</h4>
          <div style={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })
              }
              style={styles.priceInput}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 5000 })
              }
              style={styles.priceInput}
            />
          </div>
        </div>
        <div style={styles.filterSection}>
          <h4>Category</h4>
          <div>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filterOption === "all"}
                onChange={() => setFilterOption("all")}
              />
              All Products
            </label>
          </div>
          <div>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="filter"
                value="discounted"
                checked={filterOption === "discounted"}
                onChange={() => setFilterOption("discounted")}
              />
              Discounted
            </label>
          </div>
          <div>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="filter"
                value="inStock"
                checked={filterOption === "inStock"}
                onChange={() => setFilterOption("inStock")}
              />
              In Stock
            </label>
          </div>
        </div>
      </div>

      <div style={styles.productContainer}>
        <h2 style={styles.resultsHeader}>
          Showing{" "}
          {selectedPattern
            ? groupedProducts[selectedPattern]?.length || 0
            : Object.values(groupedProducts).flat().length}{" "}
          of {products.length} products
        </h2>

        <div style={styles.carouselContainer}>
          <div style={styles.carousel}>
            <button
              style={{
                ...styles.carouselButton,
                backgroundColor: selectedPattern === null ? "#ff5722" : "#f1f1f1",
                color: selectedPattern === null ? "white" : "#333",
              }}
              onClick={() => setSelectedPattern(null)}
            >
              All ({Object.values(groupedProducts).flat().length})
            </button>
            {Object.entries(groupedProducts).map(([pattern, patternProducts]) => (
              <button
                key={pattern}
                style={{
                  ...styles.carouselButton,
                  backgroundColor: selectedPattern === pattern ? "#ff5722" : "#f1f1f1",
                  color: selectedPattern === pattern ? "white" : "#333",
                }}
                onClick={() => setSelectedPattern(pattern)}
              >
                {pattern} ({patternProducts.length})
              </button>
            ))}
          </div>
        </div>

        <div style={styles.patternSection}>
          {selectedPattern === null ? (
            Object.entries(groupedProducts).map(([pattern, patternProducts]) => (
              <div key={pattern}>
                <h3 style={styles.patternTitle}>{pattern} Track Pants ({patternProducts.length})</h3>
                <div style={styles.container}>
                  {patternProducts.map((product) => renderProductCard(product))}
                </div>
              </div>
            ))
          ) : groupedProducts[selectedPattern]?.length > 0 ? (
            <div>
              <h3 style={styles.patternTitle}>
                {selectedPattern} Track Pants ({groupedProducts[selectedPattern].length})
              </h3>
              <div style={styles.container}>
                {groupedProducts[selectedPattern].map((product) => renderProductCard(product))}
              </div>
            </div>
          ) : (
            <div style={styles.noResults}>
              <h3>No products found in {selectedPattern}</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    width: "100%", // Full window width
    margin: "0 auto",
    padding: "20px",
    gap: "20px",
    boxSizing: "border-box", // Ensure padding doesn't exceed width
  },
  sidebar: {
    width: "250px",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    alignSelf: "flex-start",
    position: "sticky",
    top: "20px",
  },
  sidebarTitle: {
    fontSize: "18px",
    marginTop: "0",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  filterSection: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  priceInputs: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  priceInput: {
    width: "70px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "white",
    WebkitAppearance: "none",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "5px",
    cursor: "pointer",
  },
  productContainer: {
    flex: 1,
    width: "100%", // Ensure it takes available space
  },
  resultsHeader: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "20px",
  },
  carouselContainer: {
    marginBottom: "20px",
    overflow: "hidden",
  },
  carousel: {
    display: "flex",
    overflowX: "auto",
    gap: "10px",
    paddingBottom: "10px",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "thin",
  },
  carouselButton: {
    flexShrink: 0,
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s, color 0.3s",
  },
  patternSection: {
    marginBottom: "40px",
  },
  patternTitle: {
    fontSize: "22px",
    color: "#222",
    marginBottom: "20px",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive with max 3 columns
    gap: "20px",
    maxWidth: "100%", // Ensure it fits within window
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  imageContainer: {
    position: "relative",
    height: "200px",
    backgroundColor: "#f8f8f8",
  },
  outOfStock: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "3px",
    fontSize: "12px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  productInfo: {
    padding: "15px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    height: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  brand: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
  },
  ratingContainer: {
    marginBottom: "10px",
  },
  ratingBadge: {
    backgroundColor: "#388e3c",
    color: "white",
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "12px",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "15px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#212121",
    margin: 0,
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#757575",
    fontSize: "14px",
    margin: 0,
  },
  discount: {
    color: "#388e3c",
    fontSize: "14px",
    margin: 0,
  },
  button: {
    backgroundColor: "#ff5722",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
    width: "100%",
    fontWeight: "500",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
};

export default ProductList;