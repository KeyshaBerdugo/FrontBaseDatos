import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import AppContainer from "../components/AppContainer";
import CrearResena from "../pages/crearResena";
import GenresPage from "../pages/genre";
import TitleGenresPage from "../pages/titleGenre";
import TitleDetailPage from "../pages/titleDetail";
import CreditsPage from "../pages/credits";
import PersonsPage from "../pages/person";
import TitlesPage from "../pages/titles";

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
        path="/titles/manage"
        element={
          <AppContainer>
            <TitlesPage />
          </AppContainer>
        }
      />
      <Route
        path="/person"
        element={
          <AppContainer>
            <PersonsPage />
          </AppContainer>
        }
      />

      <Route
        path="/titles/:titleId/credits"
        element={
          <AppContainer>
            <CreditsPage />
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


      {/* ✅ Página para géneros generales */}
      <Route
        path="/genres"
        element={
          <AppContainer>
            <GenresPage />
          </AppContainer>
        }
      />

      {/* ✅ Página para géneros asociados a un título */}
      <Route
        path="/titles/:titleId/genres"
        element={
          <AppContainer>
            <TitleGenresPage />
          </AppContainer>
        }
      />
      <Route
  path="/titles/:titleId"
  element={
    <AppContainer>
      <TitleDetailPage />
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