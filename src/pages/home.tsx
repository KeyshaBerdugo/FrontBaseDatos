import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.scss";

interface Obra {
  Id_Title: string;
  Name_Title: string;
  Title_Kind: string;
  Synopsis: string;
}

const Home: React.FC = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/titles")
      .then((res) => res.json())
      .then((data) => setObras(data))
      .catch((err) => console.error("Error al cargar títulos:", err));
  }, []);

  // Mapa de imágenes por Id_Title
  const imagenes: Record<string, string> = {
    "CIEN-WORK": "https://www.lacoladerata.co/wp-content/uploads/2018/07/CienA%C3%B1osDeSoledad.jpg",
    "LOTR-WORK": "https://www.cnet.com/a/img/resize/12a21371ce304a21373e8344f7254fcd6914bb65/hub/2014/12/02/99323142-89a5-4788-bef1-c2e697aea2fb/lotr-fellowship-ring-frodo-elijah-wood.jpg?auto=webp&width=1200",
    "TWILIGHT-WORK": "https://img.chilango.com/cdn-cgi/image/width=1000,quality=75,format=auto,onerror=redirect/2025/09/saga-de-crepusculo-maraton-gratis-2.jpg",
    "CRONICA-WORK": "https://wmagazin.com/wp-content/uploads/2021/04/ES-ppal-Cronicadeunamuerteanunciada-40anos-historiaReal-1.jpg",
    "HP-WORK": "https://preview.redd.it/happy-43rd-birthday-harry-potter-v0-syzsfnxmj6fb1.jpg?width=640&crop=smart&auto=webp&s=12b1dbed65865f9ee5628a51b668d6041afadccb",
    "ASOIAF-WORK": "https://upload.wikimedia.org/wikipedia/en/d/dc/A_Song_of_Ice_and_Fire_book_collection_box_set_cover.jpg",
    "ATMVENTANA-WORK": "https://i0.wp.com/www.kibit.cl/wp-content/uploads/2019/10/a-trav%C3%A9s-de-mi-ventana-e1571965965615.jpg?resize=1536%2C1269&ssl=1",
  };

  // Filtrado por búsqueda y tipo
  const filteredObras = obras.filter((obra) =>
    obra.Name_Title.toLowerCase().includes(search.toLowerCase()) &&
    (tipo ? obra.Title_Kind === tipo : true)
  );

  return (
    <div className="home font-[Poppins]">
      {/* HERO */}
      <section className="hero">
        <h1>Explora, opina y comparte lecturas</h1>
        <p>Encuentra reseñas y descubre adaptaciones de tus obras favoritas.</p>
      </section>

      {/* Búsqueda y filtro */}
      <section className="search-section">
        <input
          type="text"
          placeholder="🔍 Buscar obra por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="filter-select">
          <option value="">Todos los tipos</option>
          <option value="WORK">Obra</option>
          <option value="EDITION">Edición</option>
          <option value="ADAPTATION">Adaptación</option>
        </select>
      </section>

      {/* Obras */}
      <section className="obras">
        <h2>📚 Obras destacadas</h2>
        <div className="grid">
          {filteredObras.map((obra) => (
            <div key={obra.Id_Title} className="obra-card">
              <img src={imagenes[obra.Id_Title]} alt={obra.Name_Title} />
              <div className="info">
                <h3>{obra.Name_Title}</h3>
                <p><strong>Tipo:</strong> {obra.Title_Kind}</p>
                <p className="synopsis">{obra.Synopsis}</p>
                <button
                  className="btn-ver-reseñas"
                  onClick={() => navigate("/crear-resena", { state: { obra } })}
                >
                  Crear reseña
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
