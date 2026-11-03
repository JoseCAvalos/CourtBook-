const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function registrarUsuario(
  nombre: string,
  correo: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      correo,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al registrar usuario");
  }

  return data;
}

export async function iniciarSesion(
  correo: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al iniciar sesión");
  }

  return data;
}
export async function obtenerCanchas() {
  const response = await fetch(`${API_URL}/canchas`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al obtener las canchas");
  }

  return data;
}
export async function obtenerDisponibilidad(
  canchaId: number,
  fecha: string
) {
  const response = await fetch(
    `${API_URL}/canchas/${canchaId}/disponibilidad?fecha=${fecha}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al consultar disponibilidad");
  }

  return data;
}

export async function crearReserva(
  canchaId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debe iniciar sesión para realizar una reserva");
  }

  const response = await fetch(
    `${API_URL}/reservas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        canchaId,
        fecha,
        horaInicio,
        horaFin,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al crear la reserva");
  }

  return data;
}
export async function obtenerMisReservas() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debe iniciar sesión");
  }

  const response = await fetch(
    `${API_URL}/reservas/mias`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || "Error al consultar las reservas"
    );
  }

  return data;
}

export async function cancelarReserva(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debe iniciar sesión");
  }

  const response = await fetch(
    `${API_URL}/reservas/${id}/cancelar`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || "Error al cancelar la reserva"
    );
  }

  return data;
}
function obtenerToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Debe iniciar sesión");
  }

  return token;
}

export async function obtenerReservasAdmin() {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/reservas`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al obtener las reservas");
  }

  return data;
}

export async function obtenerUsuariosAdmin() {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/usuarios`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al obtener usuarios");
  }

  return data;
}

export async function cambiarEstadoReservaAdmin(
  id: number,
  estado: string
) {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/reservas/${id}/estado`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje || "Error al cambiar el estado"
    );
  }

  return data;
}

export async function crearCanchaAdmin(datos: {
  nombre: string;
  tipo: string;
  descripcion: string;
  precioHora: number;
}) {
  const token = obtenerToken();

  const response = await fetch(
    `${API_URL}/admin/canchas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al crear cancha");
  }

  return data;
}