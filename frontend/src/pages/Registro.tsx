import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    try {
      await registrarUsuario(nombre, correo, password);

      setMensaje("Usuario registrado correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>

        <p>Regístrate para reservar tus canchas.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>

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
              minLength={6}
              required
            />
          </label>

          <button type="submit">
            Registrarse
          </button>
        </form>

        {mensaje && (
          <p className="mensaje-exito">{mensaje}</p>
        )}

        {error && (
          <p className="mensaje-error">{error}</p>
        )}

        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;