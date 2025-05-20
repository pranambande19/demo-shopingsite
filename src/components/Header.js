import React from "react";
import logo from "../assets/logo.png";

const Header = ({ onLoginClick, onNewUserClick, onCartClick }) => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="JugaadKart Logo" style={styles.logo} />
        <div>
          <h1 style={styles.title}>JugaadKart</h1>
          <p style={styles.slogan}>
            Smart shopping, desi style! <br /> Jugaad laga, paisa bacha!
          </p>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={onLoginClick}>Login</button>
        <button style={styles.button} onClick={onNewUserClick}>New User</button>
        <button style={styles.button} onClick={onCartClick}>🛒</button> 
      </div>
    </header>
  );
};

const styles = {
  header: {
    width: "100%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "20px 20px",
    textAlign: "center",
    borderBottom: "3px solid #ff9800",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "130px",
    marginRight: "20px",
  },
  title: {
    fontSize: "35px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ff9800, #ff5722)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontFamily: "'Poppins', sans-serif",
    marginBottom: "5px",
  },
  slogan: {
    fontSize: "15px",
    color: "#ff9800",
    fontWeight: "500",
    textAlign: "left",
  },
  buttonContainer: {
    position: "absolute",
    top: "5px",
    right: "10px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ff9800",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Header;
