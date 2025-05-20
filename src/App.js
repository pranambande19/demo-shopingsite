import React, { useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Login from "./components/Login";
import NewUser from "./components/NewUser";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Carousels from "./components/Carousels";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Map product to Cart-compatible structure
        const cartItem = {
          id: product.id, // Expecting ProductList to pass id as _id
          name: product.name, // Expecting ProductList to pass name as title
          price: product.price, // Expecting ProductList to pass price as number
          image: product.image, // Expecting ProductList to pass image as images[0]
          quantity: 1,
        };
        return [...prevCart, cartItem];
      }
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowNewUser(false);
    setShowCart(false);
    setShowCheckout(false);
  };

  const handleNewUserClick = () => {
    setShowNewUser(true);
    setShowLogin(false);
    setShowCart(false);
    setShowCheckout(false);
  };

  const handleCartClick = () => {
    setShowCart(true);
    setShowLogin(false);
    setShowNewUser(false);
    setShowCheckout(false);
  };

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };

  const handleCloseForms = () => {
    setShowLogin(false);
    setShowNewUser(false);
    setShowCart(false);
    setShowCheckout(false);
  };

  return (
    <div style={styles.app}>
      <Header onLoginClick={handleLoginClick} onNewUserClick={handleNewUserClick} onCartClick={handleCartClick} />
      <Carousels />

      {(showLogin || showNewUser || showCart || showCheckout) && (
        <div style={styles.overlay} onClick={handleCloseForms}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {showLogin && <Login onLogin={handleCloseForms} />}
            {showNewUser && <NewUser onRegister={handleCloseForms} />}
            {showCart && (
              <Cart
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                onProceedToCheckout={handleProceedToCheckout}
              />
            )}
            {showCheckout && <Checkout cartTotal={cartTotal} />}
          </div>
        </div>
      )}

      <ProductList addToCart={addToCart} />
    </div>
  );
};

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default App;