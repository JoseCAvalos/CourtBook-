import { Link } from "react-router-dom";

function Inicio() {
  return (
    <main>
      <h2>
        Reserva tu cancha de forma fácil y rápida
      </h2>

      <p>
        Consulta la disponibilidad de nuestras
        canchas deportivas y realiza tu reservación
        en línea.
      </p>

      <Link
        className="boton"
        to="/canchas"
      >
        Ver canchas disponibles
      </Link>
    </main>
  );
}

export default Inicio;