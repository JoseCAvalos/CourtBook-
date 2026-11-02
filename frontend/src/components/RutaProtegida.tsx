import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  soloAdmin?: boolean;
}

function RutaProtegida({
  children,
  soloAdmin = false,
}: Props) {
  const token = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("usuario");

  if (!token || !usuarioGuardado) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioGuardado);

  if (
    soloAdmin &&
    usuario.rol !== "Administrador"
  ) {
    return <Navigate to="/canchas" replace />;
  }

  return children;
}

export default RutaProtegida;