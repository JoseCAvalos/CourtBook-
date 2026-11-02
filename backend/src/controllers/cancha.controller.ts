import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listarCanchas = async (_req: Request, res: Response) => {
  try {
    const canchas = await prisma.cancha.findMany({
      where: {
        activa: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.json(canchas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al obtener las canchas",
    });
  }
};

export const crearCancha = async (req: Request, res: Response) => {
  try {
    const { nombre, tipo, descripcion, precioHora } = req.body;

    if (!nombre || !tipo || precioHora === undefined) {
      return res.status(400).json({
        mensaje: "Nombre, tipo y precio por hora son obligatorios",
      });
    }

    const precio = Number(precioHora);

    if (Number.isNaN(precio) || precio <= 0) {
      return res.status(400).json({
        mensaje: "El precio por hora debe ser un número mayor que cero",
      });
    }

    const cancha = await prisma.cancha.create({
      data: {
        nombre,
        tipo,
        descripcion: descripcion || null,
        precioHora: precio,
      },
    });

    return res.status(201).json({
      mensaje: "Cancha creada correctamente",
      cancha,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear la cancha",
    });
  }
};

export const editarCancha = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre, tipo, descripcion, precioHora } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID de cancha inválido",
      });
    }

    const canchaExistente = await prisma.cancha.findUnique({
      where: { id },
    });

    if (!canchaExistente) {
      return res.status(404).json({
        mensaje: "Cancha no encontrada",
      });
    }

    let precio;

    if (precioHora !== undefined) {
      precio = Number(precioHora);

      if (Number.isNaN(precio) || precio <= 0) {
        return res.status(400).json({
          mensaje: "El precio por hora debe ser mayor que cero",
        });
      }
    }

    const cancha = await prisma.cancha.update({
      where: { id },
      data: {
        nombre,
        tipo,
        descripcion,
        precioHora: precio,
      },
    });

    return res.json({
      mensaje: "Cancha actualizada correctamente",
      cancha,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al actualizar la cancha",
    });
  }
};

export const cambiarEstadoCancha = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { activa } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID de cancha inválido",
      });
    }

    if (typeof activa !== "boolean") {
      return res.status(400).json({
        mensaje: "El campo activa debe ser true o false",
      });
    }

    const canchaExistente = await prisma.cancha.findUnique({
      where: { id },
    });

    if (!canchaExistente) {
      return res.status(404).json({
        mensaje: "Cancha no encontrada",
      });
    }

    const cancha = await prisma.cancha.update({
      where: { id },
      data: { activa },
    });

    return res.json({
      mensaje: activa
        ? "Cancha activada correctamente"
        : "Cancha desactivada correctamente",
      cancha,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al cambiar el estado de la cancha",
    });
  }
};