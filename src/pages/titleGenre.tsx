import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/genre.scss";

interface TitleGenre {
  idGenre: number;
  name: string;
  description: string;
}

interface Genre {
  idGenre: number;
  name: string;
}

const TitleGenresPage: React.FC = () => {
  const { titleId } = useParams<{ titleId: string }>();
  const navigate = useNavigate();
  const [titleGenres, setTitleGenres] = useState<TitleGenre[]>([]);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar géneros asociados al título
  const fetchTitleGenres = () => {
    setLoading(true);
    fetch(`http://localhost:8081/api/titles/${titleId}/genres`)
      .then((res) => res.json())
      .then((data) => {
        setTitleGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar géneros del título:", err);
        setLoading(false);
      });
  };

  // ✅ Cargar todos los géneros para el dropdown
  const fetchAllGenres = () => {
    fetch("http://localhost:8081/api/genres")
      .then((res) => res.json())
      .then((data) => setAllGenres(data))
      .catch((err) => console.error("Error al cargar géneros:", err));
  };

  useEffect(() => {
    fetchTitleGenres();
    fetchAllGenres();
  }, [titleId]);

  // ✅ Agregar género al título
  const handleAddGenre = async () => {
    if (!selectedGenreId) {
      alert("Selecciona un género");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8081/api/titles/${titleId}/genres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idGenre: selectedGenreId }),
      });
      if (response.ok) {
        setSelectedGenreId(null);
        fetchTitleGenres();
      }
    } catch (error) {
      console.error("Error al agregar género:", error);
    }
  };

  // ✅ Eliminar género del título
  const handleDeleteGenre = async (genreId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/titles/${titleId}/genres/${genreId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchTitleGenres();
      }
    } catch (error) {
      console.error("Error al eliminar género:", error);
    }
  };

  if (loading) return <p>Cargando géneros...</p>;

  return (
    <div className="genres-page">
      <h2>🎬 Géneros asociados al título {titleId}</h2>

      {/* Botón para volver a Home */}
      <button
        className="btn-add-genre"
        style={{ backgroundColor: "#6d28d9", marginBottom: "1rem" }}
        onClick={() => navigate("/home")}
      >
        ⬅ Volver a Home
      </button>

      {/* Dropdown para agregar género */}
      <div className="genre-form">
        <select
          value={selectedGenreId || ""}
          onChange={(e) => setSelectedGenreId(Number(e.target.value))}
        >
          <option value="">Selecciona un género</option>
          {allGenres.map((genre) => (
            <option key={genre.idGenre} value={genre.idGenre}>
              {genre.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddGenre}>Agregar género</button>
      </div>

      {/* Lista de géneros asociados */}
      <ul>
        {titleGenres.map((genre) => (
          <li key={genre.idGenre}>
            <strong>{genre.name}</strong>: {genre.description}
            <button
              style={{ marginLeft: "1rem", backgroundColor: "#6b21a8", color: "#fff" }}
              onClick={() => handleDeleteGenre(genre.idGenre)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TitleGenresPage;