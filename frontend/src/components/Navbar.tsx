import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  return (
    <header>
      <Link to="/">
        <h1>CourtBook</h1>
      </Link>

      <nav>
        <Link to="/">Inicio</Link>

        <Link to="/canchas">
          Canchas
        </Link>

        {token && (
          <Link to="/mis-reservas">
            Mis reservas
          </Link>
        )}

        {usuario?.rol === "Administrador" && (
          <Link to="/admin">
            Administración
          </Link>
        )}

        {!token ? (
          <>
            <Link to="/login">
              Iniciar sesión
            </Link>

            <Link to="/registro">
              Registrarse
            </Link>
          </>
        ) : (
          <button
            className="boton-logout"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;