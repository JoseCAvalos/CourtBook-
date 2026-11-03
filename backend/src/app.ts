import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import canchaRoutes from "./routes/cancha.routes";
import adminRoutes from "./routes/admin.routes";
import reservaRoutes from "./routes/reserva.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API CourtBook funcionando correctamente",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/canchas", canchaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reservas", reservaRoutes);

export default app;