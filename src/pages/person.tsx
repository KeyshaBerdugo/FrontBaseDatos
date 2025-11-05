import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/persons.scss";

interface Person {
  idPerson: number;
  name: string;
  birthDate: string;
  country: string;
}

const PersonsPage: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<Person, "idPerson">>({
    name: "",
    birthDate: "",
    country: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/persons");
      const data = await res.json();
      setPersons(data);
    } catch (err) {
      console.error("Error al cargar personas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.birthDate.trim() || !form.country.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8081/api/persons/${editingId}`
      : "http://localhost:8081/api/persons";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al guardar persona: " + errorText);
        return;
      }

      setForm({ name: "", birthDate: "", country: "" });
      setEditingId(null);
      fetchPersons();
    } catch (error) {
      console.error("Error al guardar persona:", error);
    }
  };

  const handleEdit = (person: Person) => {
    setForm({
      name: person.name,
      birthDate: person.birthDate,
      country: person.country,
    });
    setEditingId(person.idPerson);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta persona?")) return;

    try {
      const response = await fetch(`http://localhost:8081/api/persons/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPersons();
      } else {
        alert("Error al eliminar persona");
      }
    } catch (error) {
      console.error("Error al eliminar persona:", error);
    }
  };

  return (
    <div className="persons-page">
      <h2>👤 Gestión de Personas</h2>

      <button
        className="btn-back"
        style={{ backgroundColor: "#6d28d9", marginBottom: "1rem" }}
        onClick={() => navigate("/home")}
      >
        Volver a Home
      </button>

      <form onSubmit={handleSubmit} className="person-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Fecha de nacimiento"
          value={form.birthDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="País"
          value={form.country}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Actualizar persona" : "Crear persona"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", birthDate: "", country: "" });
              setEditingId(null);
            }}
          >
            Cancelar edición
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando personas...</p>
      ) : persons.length > 0 ? (
       <ul>
  {persons.map((person) => (
    <li key={person.idPerson}>
      <div>
        <strong>{person.name}</strong> ({person.birthDate}) - {person.country}
      </div>
      <div className="actions">
        <button onClick={() => handleEdit(person)}>Editar</button>
        <button onClick={() => handleDelete(person.idPerson)}>Eliminar</button>
      </div>
    </li>
  ))}
</ul>
      ) : (
        <p>No hay personas registradas.</p>
      )}
    </div>
  );
};

export default PersonsPage;