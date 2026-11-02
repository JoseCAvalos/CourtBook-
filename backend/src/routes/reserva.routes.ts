import { Router } from "express";
import {
  crearReserva,
  misReservas,
  cancelarReserva,
} from "../controllers/reserva.controller";

import {
  verificarToken,
} from "../middleware/auth.middleware";

const router = Router();

router.use(verificarToken);

router.post("/", crearReserva);
router.get("/mias", misReservas);
router.patch("/:id/cancelar", cancelarReserva);

export default router;