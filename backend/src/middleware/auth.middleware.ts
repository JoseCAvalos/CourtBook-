import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  correo: string;
  rol: string;
}

export interface AuthRequest extends Request {
  usuario?: TokenPayload;
}

export const verificarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensaje: "Token no proporcionado",
      });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        mensaje: "Formato de token inválido",
      });
    }

    const token = partes[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET no está definida");
    }

    const payload = jwt.verify(token, jwtSecret) as TokenPayload;

    req.usuario = payload;

    next();
  } catch {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};

export const soloAdministrador = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Usuario no autenticado",
    });
  }

  if (req.usuario.rol !== "Administrador") {
    return res.status(403).json({
      mensaje: "Acceso exclusivo para administradores",
    });
  }

  next();
};