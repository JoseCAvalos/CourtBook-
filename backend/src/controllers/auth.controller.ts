import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe contener al menos 6 caracteres",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El correo electrónico ya está registrado",
      });
    }

    const rolUsuario = await prisma.rol.findUnique({
      where: { nombre: "Usuario" },
    });

    if (!rolUsuario) {
      return res.status(500).json({
        mensaje: "No se encontró el rol Usuario",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        passwordHash,
        rolId: rolUsuario.id,
      },
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
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
      include: {
        rol: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.passwordHash
    );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET no está definida");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
      jwtSecret,
      {
        expiresIn: "8h",
      }
    );

    return res.json({
      mensaje: "Inicio de sesión correcto",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};