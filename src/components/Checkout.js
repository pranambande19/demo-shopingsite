import React, { useState } from "react";

const Checkout = ({ cartTotal }) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(cartTotal * 0.1); 
    } else if (coupon === "SAVE20") {
      setDiscount(cartTotal * 0.2);
    } else {
      setDiscount(0);
      alert("Invalid Coupon Code");
    }
  };

  const finalTotal = cartTotal - discount;

  return (
    <div style={styles.checkoutContainer}>
      <h2>Checkout</h2>
      <p>Cart Total: ₹{cartTotal.toFixed(2)}</p>

      <div style={styles.couponContainer}>
        <input
          type="text"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          style={styles.input}
        />
        <button onClick={applyCoupon} style={styles.button}>
          Apply
        </button>
      </div>

      {discount > 0 && <p style={styles.discountText}>Discount: -₹{discount.toFixed(2)}</p>}
      <h3>Total Payable: ₹{finalTotal.toFixed(2)}</h3>

      <button style={styles.checkoutButton}>Proceed to Payment</button>
    </div>
  );
};

const styles = {
  checkoutContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  couponContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  discountText: {
    color: "green",
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default Checkout;
