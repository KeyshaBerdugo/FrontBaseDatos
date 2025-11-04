import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.scss";

export default function Header() {
  return (
    <header className="navbar">
      <nav>
        <Link to="/home">Inicio</Link>
        <Link to="/nueva-reseña">Crear reseña</Link>
      </nav>
      <div className="auth-buttons">
        <Link to="/login" className="btn-login">Iniciar sesión</Link>
        <Link to="/register" className="btn-register">Registrarse</Link>
      </div>
    </header>
  );
}