import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const formatoHoraValido = (hora: string) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
};

export const consultarDisponibilidad = async (
  req: Request,
  res: Response
) => {
  try {
    const canchaId = Number(req.params.id);
    const fecha = req.query.fecha as string;

    if (Number.isNaN(canchaId)) {
      return res.status(400).json({
        mensaje: "ID de cancha inválido",
      });
    }

    if (!fecha) {
      return res.status(400).json({
        mensaje: "Debe proporcionar una fecha",
      });
    }

    const cancha = await prisma.cancha.findUnique({
      where: { id: canchaId },
    });

    if (!cancha || !cancha.activa) {
      return res.status(404).json({
        mensaje: "Cancha no encontrada o inactiva",
      });
    }

    const estadoCancelada = await prisma.estadoReserva.findUnique({
      where: { nombre: "Cancelada" },
    });

    if (!estadoCancelada) {
      return res.status(500).json({
        mensaje: "No se encontró el estado Cancelada",
      });
    }

    const fechaConsulta = new Date(`${fecha}T00:00:00.000Z`);

    if (Number.isNaN(fechaConsulta.getTime())) {
      return res.status(400).json({
        mensaje: "Fecha inválida",
      });
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        canchaId,
        fecha: fechaConsulta,
        estadoId: {
          not: estadoCancelada.id,
        },
      },
      select: {
        id: true,
        horaInicio: true,
        horaFin: true,
        estado: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        horaInicio: "asc",
      },
    });

    return res.json({
      cancha: {
        id: cancha.id,
        nombre: cancha.nombre,
      },
      fecha,
      horariosOcupados: reservas,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al consultar disponibilidad",
    });
  }
};

export const crearReserva = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const { canchaId, fecha, horaInicio, horaFin } = req.body;

    const idCancha = Number(canchaId);

    if (!canchaId || !fecha || !horaInicio || !horaFin) {
      return res.status(400).json({
        mensaje:
          "Cancha, fecha, hora de inicio y hora de finalización son obligatorias",
      });
    }

    if (Number.isNaN(idCancha)) {
      return res.status(400).json({
        mensaje: "ID de cancha inválido",
      });
    }

    if (
      !formatoHoraValido(horaInicio) ||
      !formatoHoraValido(horaFin)
    ) {
      return res.status(400).json({
        mensaje: "Las horas deben utilizar el formato HH:MM",
      });
    }

    if (horaInicio >= horaFin) {
      return res.status(400).json({
        mensaje: "La hora de inicio debe ser menor que la hora final",
      });
    }

    const fechaReserva = new Date(`${fecha}T00:00:00.000Z`);

    if (Number.isNaN(fechaReserva.getTime())) {
      return res.status(400).json({
        mensaje: "Fecha inválida",
      });
    }

    const hoy = new Date();
    hoy.setUTCHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({
        mensaje: "No se pueden realizar reservas en fechas pasadas",
      });
    }

    const cancha = await prisma.cancha.findUnique({
      where: { id: idCancha },
    });

    if (!cancha || !cancha.activa) {
      return res.status(404).json({
        mensaje: "La cancha no existe o se encuentra inactiva",
      });
    }

    const estadoCancelada = await prisma.estadoReserva.findUnique({
      where: { nombre: "Cancelada" },
    });

    const estadoPendiente = await prisma.estadoReserva.findUnique({
      where: { nombre: "Pendiente" },
    });

    if (!estadoCancelada || !estadoPendiente) {
      return res.status(500).json({
        mensaje: "No se encontraron los estados necesarios",
      });
    }

    const conflicto = await prisma.reserva.findFirst({
      where: {
        canchaId: idCancha,
        fecha: fechaReserva,
        estadoId: {
          not: estadoCancelada.id,
        },

        AND: [
          {
            horaInicio: {
              lt: horaFin,
            },
          },
          {
            horaFin: {
              gt: horaInicio,
            },
          },
        ],
      },
    });

    if (conflicto) {
      return res.status(409).json({
        mensaje:
          "La cancha ya se encuentra reservada total o parcialmente en ese horario",
      });
    }

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: req.usuario.id,
        canchaId: idCancha,
        estadoId: estadoPendiente.id,
        fecha: fechaReserva,
        horaInicio,
        horaFin,
      },
      include: {
        cancha: true,
        estado: true,
      },
    });

    return res.status(201).json({
      mensaje: "Reserva creada correctamente",
      reserva,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear la reserva",
    });
  }
};

export const misReservas = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: req.usuario.id,
      },
      include: {
        cancha: true,
        estado: true,
      },
      orderBy: [
        {
          fecha: "desc",
        },
        {
          horaInicio: "asc",
        },
      ],
    });

    return res.json(reservas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al consultar las reservas",
    });
  }
};

export const cancelarReserva = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID de reserva inválido",
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: {
        estado: true,
      },
    });

    if (!reserva) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada",
      });
    }

    if (reserva.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No puede cancelar una reserva de otro usuario",
      });
    }

    if (reserva.estado.nombre === "Cancelada") {
      return res.status(400).json({
        mensaje: "La reserva ya se encuentra cancelada",
      });
    }

    if (reserva.estado.nombre === "Finalizada") {
      return res.status(400).json({
        mensaje: "No se puede cancelar una reserva finalizada",
      });
    }

    const estadoCancelada = await prisma.estadoReserva.findUnique({
      where: { nombre: "Cancelada" },
    });

    if (!estadoCancelada) {
      return res.status(500).json({
        mensaje: "No se encontró el estado Cancelada",
      });
    }

    const reservaActualizada = await prisma.reserva.update({
      where: { id },
      data: {
        estadoId: estadoCancelada.id,
      },
      include: {
        cancha: true,
        estado: true,
      },
    });

    return res.json({
      mensaje: "Reserva cancelada correctamente",
      reserva: reservaActualizada,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al cancelar la reserva",
    });
  }
};
export const listarTodasLasReservas = async (
  _req: Request,
  res: Response
) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          },
        },
        cancha: true,
        estado: true,
      },
      orderBy: [
        {
          fecha: "desc",
        },
        {
          horaInicio: "asc",
        },
      ],
    });

    return res.json(reservas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al consultar las reservas",
    });
  }
};

export const cambiarEstadoReserva = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID de reserva inválido",
      });
    }

    if (!estado) {
      return res.status(400).json({
        mensaje: "Debe proporcionar un estado",
      });
    }

    const estadosPermitidos = [
      "Pendiente",
      "Confirmada",
      "Cancelada",
      "Finalizada",
    ];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado de reserva inválido",
      });
    }

    const reserva = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reserva) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada",
      });
    }

    const estadoReserva = await prisma.estadoReserva.findUnique({
      where: {
        nombre: estado,
      },
    });

    if (!estadoReserva) {
      return res.status(404).json({
        mensaje: "Estado no encontrado",
      });
    }

    const reservaActualizada = await prisma.reserva.update({
      where: { id },
      data: {
        estadoId: estadoReserva.id,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
          },
        },
        cancha: true,
        estado: true,
      },
    });

    return res.json({
      mensaje: "Estado de reserva actualizado correctamente",
      reserva: reservaActualizada,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al actualizar el estado de la reserva",
    });
  }
};