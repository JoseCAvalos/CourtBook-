import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCanchas } from "../services/api";

interface Cancha {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  precioHora: string;
  activa: boolean;
}

function Canchas() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        const data = await obtenerCanchas();
        setCanchas(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setCargando(false);
      }
    };

    cargarCanchas();
  }, []);

  if (cargando) {
    return (
      <main>
        <p>Cargando canchas...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Canchas disponibles</h1>

      {error && <p className="mensaje-error">{error}</p>}

      {canchas.length === 0 ? (
        <p>No hay canchas disponibles actualmente.</p>
      ) : (
        <div className="canchas-grid">
          {canchas.map((cancha) => (
            <article className="cancha-card" key={cancha.id}>
              <h2>{cancha.nombre}</h2>

              <p>
                <strong>Tipo:</strong> {cancha.tipo}
              </p>

              <p>
                {cancha.descripcion || "Sin descripción"}
              </p>

              <p className="precio">
                Q{cancha.precioHora} / hora
              </p>

              <Link
                className="boton"
                to={`/reservar/${cancha.id}`}
              >
                Ver disponibilidad
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Canchas;