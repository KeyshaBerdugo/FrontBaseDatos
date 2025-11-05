import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/credits.scss";

interface Credit {
  idPerson: number;
  personName: string;
  role: string;
}

interface Person {
  idPerson: number;
  name: string;
}

interface CreditForm {
  idPerson: number;
  role: string;
}

const CreditsPage: React.FC = () => {
  const { titleId } = useParams<{ titleId: string }>();
  const navigate = useNavigate();

  const [credits, setCredits] = useState<Credit[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [form, setForm] = useState<CreditForm>({ idPerson: 0, role: "" });
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [loadingPersons, setLoadingPersons] = useState(true);

  // Fetch créditos
  const fetchCredits = async () => {
    setLoadingCredits(true);
    try {
      const res = await fetch(`http://localhost:8081/api/titles/${titleId}/credits`);
      const data = await res.json();
      setCredits(data);
    } catch (err) {
      console.error("Error al cargar créditos:", err);
    } finally {
      setLoadingCredits(false);
    }
  };

  // Fetch personas
  const fetchPersons = async () => {
    setLoadingPersons(true);
    try {
      const res = await fetch("http://localhost:8081/api/persons");
      const data = await res.json();
      setPersons(data);
    } catch (err) {
      console.error("Error al cargar personas:", err);
    } finally {
      setLoadingPersons(false);
    }
  };

  useEffect(() => {
    if (titleId) {
      fetchCredits();
      fetchPersons();
    }
  }, [titleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.idPerson || !form.role.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/titles/${titleId}/credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al agregar crédito: " + errorText);
        return;
      }

      setForm({ idPerson: 0, role: "" });
      fetchCredits();
    } catch (error) {
      console.error("Error al agregar crédito:", error);
    }
  };

  const handleDelete = async (idPerson: number) => {
    if (!window.confirm("¿Eliminar este crédito?")) return;

    try {
      const response = await fetch(
        `http://localhost:8081/api/titles/${titleId}/credits/${idPerson}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchCredits();
      } else {
        alert("Error al eliminar crédito");
      }
    } catch (error) {
      console.error("Error al eliminar crédito:", error);
    }
  };

  return (
    <div className="credits-page">
      <h2>🎬 Créditos del título</h2>

      <button
        className="btn-back"
        style={{ backgroundColor: "#6d28d9", marginBottom: "1rem" }}
        onClick={() => navigate(`/titles/${titleId}`)}
      >
        ⬅ Volver al detalle
      </button>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="credit-form">
        {loadingPersons ? (
          <p>Cargando personas...</p>
        ) : (
          <select
            name="idPerson"
            value={form.idPerson}
            onChange={(e) => setForm({ ...form, idPerson: Number(e.target.value) })}
            required
          >
            <option value="">Selecciona una persona</option>
            {persons.map((p) => (
              <option key={p.idPerson} value={p.idPerson}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          name="role"
          placeholder="Rol (ej. Autor, Director)"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
        <button type="submit">Agregar crédito</button>
      </form>

      {/* Lista de créditos */}
      {loadingCredits ? (
        <p>Cargando créditos...</p>
      ) : credits.length > 0 ? (
        <ul>
          {credits.map((credit) => (
            <li key={credit.idPerson}>
              <strong>{credit.personName}</strong> - {credit.role}
              <button onClick={() => handleDelete(credit.idPerson)}>Eliminar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay créditos registrados.</p>
      )}
    </div>
  );
};

export default CreditsPage;