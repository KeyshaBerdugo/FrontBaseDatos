import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IonToast
} from "@ionic/react";
import "../styles/resena.scss";

export default function CrearReseña() {
  const navigate = useNavigate();
  const location = useLocation();
  
const obra = location.state?.obra;
const obraId = obra?.Id_Title || "";

  const [email, setEmail] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [status, setStatus] = useState("PUBLICADA");
  const [spoiler, setSpoiler] = useState(false);
  const [comentario, setComentario] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Función de validación de email
  const validarEmail = (correo: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !validarEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    if (calificacion < 1 || calificacion > 5) {
      setError("La calificación debe estar entre 1 y 5.");
      return;
    }

    const data = {
      email,
      idTitle: obraId,
      rating: calificacion,
      status,
      spoiler,
      comment: comentario,
      dateCreated: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(resData.message || "Error al enviar la reseña.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="crear-resena-page font-[Poppins]">
      <div className="resena-card">
        <h2>Crear reseña</h2>
        <p>Completa los datos de tu reseña</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />

          <label htmlFor="calificacion">Calificación ⭐</label>
          <select
            id="calificacion"
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((v) => (
              <option key={v} value={v}>
                {v} estrellas
              </option>
            ))}
          </select>

          <label htmlFor="status">Estado</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PUBLICADA">PUBLICADA</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="BORRADOR">BORRADOR</option>
          </select>

          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe tu opinión sobre la obra..."
          />

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="spoiler"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
            />
            <label htmlFor="spoiler">Contiene spoilers</label>
          </div>

          <div className="botones">
            <button type="submit">Publicar reseña</button>
            <button type="button" onClick={() => navigate("/home")}>
              Volver
            </button>
          </div>
        </form>

        {/* Toasts para éxito y error */}
        <IonToast
          isOpen={success}
          message="✅ Reseña publicada con éxito"
          duration={1500}
          color="success"
          onDidDismiss={() => setSuccess(false)}
        />
        <IonToast
          isOpen={!!error}
          message={`❌ ${error}`}
          duration={2000}
          color="danger"
          onDidDismiss={() => setError("")}
        />
      </div>
    </div>
  );
}
