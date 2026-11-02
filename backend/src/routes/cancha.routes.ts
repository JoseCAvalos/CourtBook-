import { Router } from "express";

import {
  listarCanchas,
} from "../controllers/cancha.controller";

import {
  consultarDisponibilidad,
} from "../controllers/reserva.controller";

const router = Router();

router.get("/", listarCanchas);

router.get(
  "/:id/disponibilidad",
  consultarDisponibilidad
);

export default router;