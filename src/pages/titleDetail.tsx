import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/title.scss";

interface Genre {
  idGenre: number;
  name: string;
  description: string;
}

interface Credit {
  idPerson: number;
  personName: string;
  role: string;
}

interface Work {
  idTitle: string;
  originalLanguage: string;
  originalCountry: string;
  originalMedium: string;
  creationYear: number | null;
  creationDate: string | null;
}

interface Edition {
  idTitle: string | null;
  idWorkTitle: string | null;
  isbn: string | null;
  datePublication: string | null;
  publisher: string | null;
  pages: number | null;
  language: string | null;
}

interface Adaptation {
  idTitle: string;
  idWorkTitle: string;
  adaptationType: string;
  dateReleased: string | null;
  producer: string | null;
  duration: number | null;
  language: string | null;
}

interface TitleDetail {
  title: {
    idTitle: string;
    nameTitle: string;
    titleKind: string;
    synopsis: string;
    dateCreated: string;
    dateUpdated: string;
    creationDate: string | null;
  };
  work: Work | null;
  edition: Edition | null;
  adaptation: Adaptation | null;
  genres: Genre[] | null;
  credits: Credit[] | null;
}

const TitleDetailPage: React.FC = () => {
  const { titleId } = useParams<{ titleId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<TitleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!titleId || titleId.trim() === "") return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/titles/${titleId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const genreRes = await fetch(`http://localhost:8081/api/titles/${titleId}/genres`);
        const genreData: Genre[] = genreRes.ok ? await genreRes.json() : [];

        const creditRes = await fetch(`http://localhost:8081/api/titles/${titleId}/credits`);
        const creditData: Credit[] = creditRes.ok ? await creditRes.json() : [];

        setDetail({ ...data, genres: genreData, credits: creditData });
      } catch (err) {
        console.error("Error al cargar detalle:", err);
        setError("No se pudo cargar el detalle del título.");
      }
    };

    fetchDetail();
  }, [titleId]);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este título?")) return;
    try {
      const response = await fetch(`http://localhost:8081/api/titles/${titleId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Título eliminado");
        navigate("/home");
      } else {
        alert("Error al eliminar el título");
      }
    } catch (error) {
      console.error("Error al eliminar título:", error);
    }
  };

  if (error) return <p>{error}</p>;
  if (!detail) return <p>Cargando detalle...</p>;

  const { title, work, edition, adaptation, genres, credits } = detail;

  return (
    <div className="title-detail">
      <h2>{title.nameTitle}</h2>
      <p><strong>Tipo:</strong> {title.titleKind}</p>
      <p>{title.synopsis}</p>
      <p><strong>Creado:</strong> {title.dateCreated}</p>
      <p><strong>Última actualización:</strong> {title.dateUpdated}</p>

      {/* Work */}
      {work && (
        <div className="work-section">
          <h3>Información de la obra</h3>
          <p><strong>Idioma original:</strong> {work.originalLanguage}</p>
          <p><strong>País original:</strong> {work.originalCountry}</p>
          <p><strong>Medio original:</strong> {work.originalMedium}</p>
          <p><strong>Fecha de creación:</strong> {work.creationDate || "No disponible"}</p>
        </div>
      )}

      {/* Edition */}
      {edition && (
        <div className="edition-section">
          <h3>Edición</h3>
          <p><strong>ISBN:</strong> {edition.isbn || "No disponible"}</p>
          <p><strong>Editorial:</strong> {edition.publisher || "No disponible"}</p>
          <p><strong>Páginas:</strong> {edition.pages || "No disponible"}</p>
          <p><strong>Idioma:</strong> {edition.language || "No disponible"}</p>
        </div>
      )}

      {/* Adaptation */}
      {adaptation && (
        <div className="adaptation-section">
          <h3>Adaptación</h3>
          <p><strong>Tipo:</strong> {adaptation.adaptationType}</p>
          <p><strong>Fecha de estreno:</strong> {adaptation.dateReleased || "No disponible"}</p>
          <p><strong>Productor:</strong> {adaptation.producer || "No disponible"}</p>
          <p><strong>Duración:</strong> {adaptation.duration ? `${adaptation.duration} min` : "No disponible"}</p>
          <p><strong>Idioma:</strong> {adaptation.language || "No disponible"}</p>
        </div>
      )}

      {/* Géneros */}
      <h3>Géneros asociados:</h3>
      {genres && genres.length > 0 ? (
        <ul>
          {genres.map((g) => (
            <li key={g.idGenre}>
              <strong>{g.name}</strong>: {g.description || "Sin descripción"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay géneros asociados.</p>
      )}

      {/* Créditos */}
      <h3>Créditos:</h3>
      {credits && credits.length > 0 ? (
        <ul>
          {credits.map((c, index) => (
            <li key={index}>
              {c.personName} - {c.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay créditos asociados.</p>
      )}

      {/* Botones */}
      <div className="buttons">
        <button onClick={handleDelete} className="delete-btn">Eliminar título</button>
        <button onClick={() => navigate(`/titles/${titleId}/genres`)}>Gestionar géneros</button>
        <button onClick={() => navigate(`/titles/${titleId}/credits`)}>Gestionar créditos</button>
      </div>

      <button
        className="btn-add-genre"
        style={{ backgroundColor: "#6d28d9", marginBottom: "1rem" }}
        onClick={() => navigate("/home")}
      >
        Volver a Home
      </button>
    </div>
  );
};

export default TitleDetailPage;