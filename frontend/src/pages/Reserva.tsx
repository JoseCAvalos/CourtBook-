import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  crearReserva,
  obtenerDisponibilidad,
} from "../services/api";

interface HorarioOcupado {
  id: number;
  horaInicio: string;
  horaFin: string;
  estado: {
    nombre: string;
  };
}

function Reserva() {
  const { id } = useParams();

  const canchaId = Number(id);

  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const [horariosOcupados, setHorariosOcupados] = useState<
    HorarioOcupado[]
  >([]);

  const [nombreCancha, setNombreCancha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [consultado, setConsultado] = useState(false);

  const consultar = async () => {
    setError("");
    setMensaje("");

    if (!fecha) {
      setError("Seleccione una fecha");
      return;
    }

    try {
      const data = await obtenerDisponibilidad(
        canchaId,
        fecha
      );

      setNombreCancha(data.cancha.nombre);
      setHorariosOcupados(data.horariosOcupados);
      setConsultado(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setMensaje("");

    try {
      await crearReserva(
        canchaId,
        fecha,
        horaInicio,
        horaFin
      );

      setMensaje("Reserva creada correctamente");

      setHoraInicio("");
      setHoraFin("");

      await consultar();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <main>
      <div className="reserva-container">
        <Link to="/canchas">
          ← Volver a canchas
        </Link>

        <h1>Reservar cancha</h1>

        {nombreCancha && (
          <h2>{nombreCancha}</h2>
        )}

        <div className="reserva-card">
          <label>
            Fecha
            <input
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setConsultado(false);
              }}
            />
          </label>

          <button
            className="boton"
            type="button"
            onClick={consultar}
          >
            Consultar disponibilidad
          </button>

          {consultado && (
            <div className="disponibilidad">
              <h3>Horarios ocupados</h3>

              {horariosOcupados.length === 0 ? (
                <p>
                  No hay reservas para esta fecha.
                </p>
              ) : (
                <ul>
                  {horariosOcupados.map((horario) => (
                    <li key={horario.id}>
                      {horario.horaInicio} -{" "}
                      {horario.horaFin}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <hr />

          <h3>Nueva reserva</h3>

          <form
            className="reserva-form"
            onSubmit={handleSubmit}
          >
            <label>
              Hora de inicio
              <input
                type="time"
                value={horaInicio}
                onChange={(e) =>
                  setHoraInicio(e.target.value)
                }
                required
              />
            </label>

            <label>
              Hora final
              <input
                type="time"
                value={horaFin}
                onChange={(e) =>
                  setHoraFin(e.target.value)
                }
                required
              />
            </label>

            <button type="submit" className="boton">
              Reservar
            </button>
          </form>

          {mensaje && (
            <p className="mensaje-exito">
              {mensaje}
            </p>
          )}

          {error && (
            <p className="mensaje-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Reserva;