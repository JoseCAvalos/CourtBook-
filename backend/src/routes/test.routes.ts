import { Router } from "express";
import {
  verificarToken,
  soloAdministrador,
} from "../middleware/auth.middleware";

const router = Router();

router.get("/protegida", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso autorizado",
  });
});

router.get(
  "/admin",
  verificarToken,
  soloAdministrador,
  (req, res) => {
    res.json({
      mensaje: "Acceso de administrador autorizado",
    });
  }
);

export default router;