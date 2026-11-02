import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  cambiarEstadoReservaAdmin,
  crearCanchaAdmin,
  obtenerReservasAdmin,
  obtenerUsuariosAdmin,
} from "../services/api";

interface ReservaAdmin {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;

  usuario: {
    nombre: string;
    correo: string;
  };

  cancha: {
    nombre: string;
  };

  estado: {
    nombre: string;
  };
}

interface UsuarioAdmin {
  id: number;
  nombre: string;
  correo: string;
  fechaCreacion: string;

  rol: {
    nombre: string;
  };
}

function Admin() {
  const [reservas, setReservas] = useState<ReservaAdmin[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [seccion, setSeccion] = useState("reservas");

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioHora, setPrecioHora] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      const [datosReservas, datosUsuarios] = await Promise.all([
        obtenerReservasAdmin(),
        obtenerUsuariosAdmin(),
      ]);

      setReservas(datosReservas);
      setUsuarios(datosUsuarios);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarEstado = async (
    id: number,
    estado: string
  ) => {
    setMensaje("");
    setError("");

    try {
      await cambiarEstadoReservaAdmin(id, estado);

      setMensaje("Estado actualizado correctamente");

      await cargarDatos();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleCrearCancha = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    try {
      await crearCanchaAdmin({
        nombre,
        tipo,
        descripcion,
        precioHora: Number(precioHora),
      });

      setMensaje("Cancha creada correctamente");

      setNombre("");
      setTipo("");
      setDescripcion("");
      setPrecioHora("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <main>
      <div className="admin-container">
        <h1>Panel administrativo</h1>

        <p>
          Administración general de CourtBook.
        </p>

        <div className="admin-menu">
          <button
            onClick={() => setSeccion("reservas")}
          >
            Reservas
          </button>

          <button
            onClick={() => setSeccion("canchas")}
          >
            Nueva cancha
          </button>

          <button
            onClick={() => setSeccion("usuarios")}
          >
            Usuarios
          </button>
        </div>

        {mensaje && (
          <p className="mensaje-exito">{mensaje}</p>
        )}

        {error && (
          <p className="mensaje-error">{error}</p>
        )}

        {seccion === "reservas" && (
          <section className="admin-seccion">
            <h2>Reservas</h2>

            <div className="tabla-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Cancha</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estado</th>
                    <th>Modificar</th>
                  </tr>
                </thead>

                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.usuario.nombre}</td>

                      <td>{reserva.cancha.nombre}</td>

                      <td>
                        {new Date(
                          reserva.fecha
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {reserva.horaInicio} -{" "}
                        {reserva.horaFin}
                      </td>

                      <td>
                        {reserva.estado.nombre}
                      </td>

                      <td>
                        <select
                          value={reserva.estado.nombre}
                          onChange={(e) =>
                            cambiarEstado(
                              reserva.id,
                              e.target.value
                            )
                          }
                        >
                          <option>Pendiente</option>
                          <option>Confirmada</option>
                          <option>Cancelada</option>
                          <option>Finalizada</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seccion === "canchas" && (
          <section className="admin-seccion">
            <h2>Registrar nueva cancha</h2>

            <form
              className="admin-form"
              onSubmit={handleCrearCancha}
            >
              <label>
                Nombre
                <input
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                Tipo
                <input
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(e.target.value)
                  }
                />
              </label>

              <label>
                Precio por hora
                <input
                  type="number"
                  min="1"
                  value={precioHora}
                  onChange={(e) =>
                    setPrecioHora(e.target.value)
                  }
                  required
                />
              </label>

              <button className="boton">
                Crear cancha
              </button>
            </form>
          </section>
        )}

        {seccion === "usuarios" && (
          <section className="admin-seccion">
            <h2>Usuarios registrados</h2>

            <div className="tabla-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.rol.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Admin;