import { Router } from "express";
import {
  crearCancha,
  editarCancha,
  cambiarEstadoCancha,
} from "../controllers/cancha.controller";

import {
  verificarToken,
  soloAdministrador,
} from "../middleware/auth.middleware";

import {
  listarTodasLasReservas,
  cambiarEstadoReserva,
} from "../controllers/reserva.controller";

import {
  listarUsuarios,
} from "../controllers/usuario.controller";

const router = Router();

router.use(verificarToken);
router.use(soloAdministrador);

router.post("/canchas", crearCancha);
router.patch("/canchas/:id", editarCancha);
router.patch("/canchas/:id/estado", cambiarEstadoCancha);

router.get("/reservas", listarTodasLasReservas);

router.patch(
  "/reservas/:id/estado",
  cambiarEstadoReserva
);

router.get("/usuarios", listarUsuarios);

export default router;