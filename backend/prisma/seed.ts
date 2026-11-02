import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en el archivo .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.rol.upsert({
    where: { nombre: "Usuario" },
    update: {},
    create: { nombre: "Usuario" },
  });

  await prisma.rol.upsert({
    where: { nombre: "Administrador" },
    update: {},
    create: { nombre: "Administrador" },
  });

  const estados = [
    "Pendiente",
    "Confirmada",
    "Cancelada",
    "Finalizada",
  ];

  for (const nombre of estados) {
    await prisma.estadoReserva.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  console.log("Datos iniciales creados correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });