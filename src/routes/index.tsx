import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import AppContainer from "../components/AppContainer";
import CrearResena from "../pages/crearResena"; // 👈 corregido: debe ser "../pages", no "./pages"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route
        path="/home"
        element={
          <AppContainer>
            <Home />
          </AppContainer>
        }
      />

      <Route
        path="/login"
        element={
          <AppContainer>
            <LoginPage />
          </AppContainer>
        }
      />

      <Route
        path="/register"
        element={
          <AppContainer>
            <RegisterPage />
          </AppContainer>
        }
      />

      {/* ✅ Nueva ruta para crear reseña */}
      <Route
        path="/crear-resena"
        element={
          <AppContainer>
            <CrearResena />
          </AppContainer>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
