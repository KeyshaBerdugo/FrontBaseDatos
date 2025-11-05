import React, { useEffect, useState } from "react";
import "../styles/genre.scss";
import { useNavigate } from "react-router-dom";


interface Genre {
  idGenre?: number; // ✅ usar el nombre real del backend
  name: string;
  description: string;
}


const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Genre>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const navigate = useNavigate();

const goHome = () => {
  navigate("/"); // Ajusta la ruta según tu configuración
};
  const fetchGenres = () => {
    setLoading(true);
    fetch("http://localhost:8081/api/genres")
      .then((res) => res.json())
      .then((data) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar géneros:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8081/api/genres/${editingId}`
      : "http://localhost:8081/api/genres";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        alert("Error al guardar género: " + errorText);
        return;
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchGenres();
    } catch (error) {
      console.error("Error al guardar género:", error);
    }
  };

  
const handleEdit = (genre: Genre) => {
  setForm({ name: genre.name, description: genre.description });
  setEditingId(genre.idGenre || null); // ✅ usar idGenre
};


  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/genres/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchGenres();
      }
    } catch (error) {
      console.error("Error al eliminar género:", error);
    }
  };

  if (loading) return <p>Cargando géneros...</p>;

return (
  <div className="genres-page">
    <h2>🎭 Géneros disponibles</h2>

    {/* Botón para volver a Home */}
    <button
      className="btn-add-genre"
      style={{ backgroundColor: "#6d28d9", marginBottom: "1rem" }}
      onClick={goHome}
    >
      Volver a Home
    </button>

    <form onSubmit={handleSubmit} className="genre-form">
      <input
        type="text"
        name="name"
        placeholder="Nombre del género"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {editingId ? "Actualizar género" : "Crear género"}
      </button>
      {editingId && (
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", description: "" });
            setEditingId(null);
          }}
        >
          Cancelar edición
        </button>
      )}
    </form>

    <ul>
  {genres.map((genre) => (
    <li key={genre.idGenre}>
      <strong>{genre.name}</strong>: {genre.description}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={() => handleEdit(genre)}>Editar</button>
        <button onClick={() => handleDelete(genre.idGenre!)}>Eliminar</button>
      </div>
    </li>
  ))}
</ul>
  </div>
);
};

export default GenresPage;