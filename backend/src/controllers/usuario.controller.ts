import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listarUsuarios = async (
  _req: Request,
  res: Response
) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        fechaCreacion: true,
        rol: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.json(usuarios);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al consultar los usuarios",
    });
  }
};