import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/title.scss";

interface Title {
  idTitle: string;
  nameTitle: string;
  titleKind: string;
  synopsis: string;
  dateCreated?: string;
  dateUpdated?: string;
}

const TitlesPage: React.FC = () => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Title, "idTitle">>({
    nameTitle: "",
    titleKind: "",
    synopsis: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/titles");
      const data = await res.json();
      setTitles(data);
    } catch (err) {
      console.error("Error al cargar títulos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nameTitle.trim() || !form.titleKind.trim() || !form.synopsis.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8081/api/titles/${editingId}`
      : "http://localhost:8081/api/titles";

    const payload = editingId ? form : { idTitle: crypto.randomUUID(), ...form };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al guardar título: " + errorText);
        return;
      }

      setForm({ nameTitle: "", titleKind: "", synopsis: "" });
      setEditingId(null);
      fetchTitles();
    } catch (error) {
      console.error("Error al guardar título:", error);
    }
  };

  const handleEdit = (title: Title) => {
    setForm({
      nameTitle: title.nameTitle,
      titleKind: title.titleKind,
      synopsis: title.synopsis,
    });
    setEditingId(title.idTitle);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este título?")) return;

    try {
      const response = await fetch(`http://localhost:8081/api/titles/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTitles();
      } else {
        alert("Error al eliminar título");
      }
    } catch (error) {
      console.error("Error al eliminar título:", error);
    }
  };

  return (
    <div className="titles-page">
      <h2>📚 Gestión de Títulos</h2>

      <div className="titles-container">
        {/* Botón volver */}
        <button className="btn-back" onClick={() => navigate("/home")}>
          Volver a Home
        </button>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="title-form">
          <input
            type="text"
            name="nameTitle"
            placeholder="Nombre del título"
            value={form.nameTitle}
            onChange={handleChange}
            required
          />
          <select
            name="titleKind"
            value={form.titleKind}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tipo</option>
            <option value="WORK">WORK</option>
            <option value="EDITION">EDITION</option>
            <option value="ADAPTATION">ADAPTATION</option>
          </select>
          <textarea
            name="synopsis"
            placeholder="Sinopsis"
            value={form.synopsis}
            onChange={handleChange}
            required
          />
          <div className="form-buttons">
            <button type="submit">
              {editingId ? "Actualizar título" : "Crear título"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setForm({ nameTitle: "", titleKind: "", synopsis: "" });
                  setEditingId(null);
                }}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {/* Lista de títulos */}
        {loading ? (
          <p>Cargando títulos...</p>
        ) : titles.length > 0 ? (
          <ul className="titles-list">
            {titles.map((title) => (
              <li key={title.idTitle}>
                <div className="title-info">
                  <strong>{title.nameTitle}</strong> <span>({title.titleKind})</span>
                  <p>{title.synopsis}</p>
                  {title.dateCreated && (
                    <small>
                      Creado: {new Date(title.dateCreated).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <div className="title-actions">
                  <button onClick={() => handleEdit(title)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(title.idTitle)}>
                    Eliminar
                  </button>
                  <button onClick={() => navigate(`/titles/${title.idTitle}`)}>
                    Ver detalle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay títulos registrados.</p>
        )}
      </div>
    </div>
  );
};



export default TitlesPage;