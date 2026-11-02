import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cancelarReserva,
  obtenerMisReservas,
} from "../services/api";

interface Reserva {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;

  cancha: {
    id: number;
    nombre: string;
    tipo: string;
    precioHora: string;
  };

  estado: {
    id: number;
    nombre: string;
  };
}

function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarReservas = async () => {
    try {
      const data = await obtenerMisReservas();
      setReservas(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Está seguro de cancelar esta reserva?"
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      await cancelarReserva(id);

      setMensaje("Reserva cancelada correctamente");

      await cargarReservas();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (cargando) {
    return (
      <main>
        <p>Cargando reservas...</p>
      </main>
    );
  }

  return (
    <main>
      <div className="reservas-container">
        <div className="titulo-reservas">
          <div>
            <h1>Mis reservas</h1>
            <p>
              Consulta y administra tus reservaciones.
            </p>
          </div>

          <Link className="boton" to="/canchas">
            Nueva reserva
          </Link>
        </div>

        {mensaje && (
          <p className="mensaje-exito">{mensaje}</p>
        )}

        {error && (
          <p className="mensaje-error">{error}</p>
        )}

        {reservas.length === 0 ? (
          <div className="reserva-vacia">
            <p>No tienes reservaciones todavía.</p>
          </div>
        ) : (
          <div className="lista-reservas">
            {reservas.map((reserva) => (
              <article
                key={reserva.id}
                className="reserva-item"
              >
                <div>
                  <h2>{reserva.cancha.nombre}</h2>

                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(
                      reserva.fecha
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Horario:</strong>{" "}
                    {reserva.horaInicio} -{" "}
                    {reserva.horaFin}
                  </p>

                  <p>
                    <strong>Precio:</strong>{" "}
                    Q{reserva.cancha.precioHora}
                  </p>
                </div>

                <div className="reserva-acciones">
                  <span
                    className={`estado estado-${reserva.estado.nombre.toLowerCase()}`}
                  >
                    {reserva.estado.nombre}
                  </span>

                  {reserva.estado.nombre !==
                    "Cancelada" &&
                    reserva.estado.nombre !==
                      "Finalizada" && (
                      <button
                        className="boton-cancelar"
                        onClick={() =>
                          handleCancelar(reserva.id)
                        }
                      >
                        Cancelar reserva
                      </button>
                    )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MisReservas;