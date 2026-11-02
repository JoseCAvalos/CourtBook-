import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      const data = await iniciarSesion(correo, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      if (data.usuario.rol === "Administrador") {
        navigate("/admin");
      } else {
        navigate("/canchas");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar sesión</h1>

        <p>Accede a tu cuenta de CourtBook.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">
            Iniciar sesión
          </button>
        </form>

        {error && (
          <p className="mensaje-error">{error}</p>
        )}

        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/registro">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;