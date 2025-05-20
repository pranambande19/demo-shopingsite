import React from "react";

const Cart = ({ cartItems, updateQuantity, removeItem, onProceedToCheckout }) => {
  const totalAmount = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div style={styles.cartContainer}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p style={styles.emptyCartMessage}>🛒 Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <img
                src={item.image}
                alt={item.name}
                style={styles.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/50?text=No+Image";
                }}
              />
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <div style={styles.quantityControls}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={styles.removeButton}
                aria-label={`Remove ${item.name} from cart`}
              >
                ❌
              </button>
            </div>
          ))}

          <h3 style={styles.totalAmount}>Total: ₹{totalAmount}</h3>

          <button
            style={{
              ...styles.checkoutButton,
              opacity: cartItems.length === 0 ? 0.5 : 1,
              cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={onProceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  cartContainer: {
    padding: "25px",
    minWidth: "350px",
    maxHeight: "450px",
    overflowY: "auto",
    border: "2px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "2px solid #ccc",
    padding: "10px 0",
    gap: "10px",
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "5px",
    marginRight: "10px",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  removeButton: {
    backgroundColor: "grey",
    color: "white",
    padding: "5px",
    border: "none",
    cursor: "pointer",
  },
  totalAmount: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "right",
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginTop: "10px",
  },
  emptyCartMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#888",
  },
};

export default Cart;