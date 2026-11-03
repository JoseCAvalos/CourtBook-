# CourtBook

CourtBook es una aplicación web para la gestión y reserva de canchas deportivas. Permite a los usuarios registrarse, iniciar sesión, consultar disponibilidad, crear y cancelar reservas. También incluye un panel administrativo para gestionar canchas, usuarios y estados de reservas.

## Demo pública

- Frontend: https://courtbook-frontend.onrender.com
- Backend: https://courtbook-backend.onrender.com

> El backend está desplegado en el plan gratuito de Render, por lo que puede tardar unos segundos en responder después de un período de inactividad.

## Arquitectura

```text
React + TypeScript (Frontend)
            |
            | REST API / JSON
            v
Node.js + Express + TypeScript
            |
            | Prisma ORM
            v
        PostgreSQL
```

## Tecnologías

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express
- TypeScript
- JWT
- bcrypt

### Base de datos
- PostgreSQL
- Prisma ORM

### DevOps y calidad
- Docker
- Docker Compose
- GitHub Actions
- Render
- Vitest
- Supertest
- React Testing Library
- Playwright

## Funcionalidades

### Usuario
- Registro e inicio de sesión.
- Consulta de canchas activas.
- Consulta de disponibilidad por fecha.
- Creación de reservas.
- Consulta de reservas propias.
- Cancelación de reservas.
- Cierre de sesión.

### Administrador
- Acceso a panel administrativo.
- Creación y edición de canchas.
- Activación y desactivación de canchas.
- Consulta de usuarios registrados.
- Consulta de todas las reservas.
- Modificación del estado de una reserva.

## Reglas principales

- Solo se pueden reservar canchas activas.
- No se permiten reservas activas superpuestas para la misma cancha, fecha y horario.
- Cada reserva pertenece a un usuario y una cancha.
- Un usuario solo puede cancelar sus propias reservas.
- Las rutas administrativas requieren rol `Administrador`.
- Las contraseñas se almacenan usando hash con bcrypt.
- Los estados disponibles son: `Pendiente`, `Confirmada`, `Cancelada` y `Finalizada`.

## Estructura

```text
CourtBook/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── e2e/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Variables de entorno

### Backend

Crear `backend/.env`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:password@localhost:5432/courtbook"
JWT_SECRET="cambia_esta_clave"
```

### Frontend

En producción se usa:

```env
VITE_API_URL=https://courtbook-backend.onrender.com/api
```

Si `VITE_API_URL` no está definida, el frontend usa:

```text
http://localhost:3000/api
```

## Ejecución local

### Backend

```bash
cd backend
npm install
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npm run seed
npm run dev
```

Backend local:

```text
http://localhost:3000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Servicios locales:

```text
Frontend:    http://localhost:8080
Backend:     http://localhost:3000
PostgreSQL:  localhost:5433
```

Para detenerlos:

```bash
docker compose down
```

## Pruebas

### Backend

```bash
cd backend
npm test
```

Usa Vitest y Supertest.

### Frontend

```bash
cd frontend
npm test
```

Usa Vitest y React Testing Library.

### End-to-End

```bash
cd frontend
npm run test:e2e
```

Usa Playwright.

## Build de producción

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
npm run build
```

## CI con GitHub Actions

El workflow se encuentra en:

```text
.github/workflows/ci.yml
```

En cada `push` o `pull_request` hacia `main`, GitHub Actions:

- instala dependencias;
- ejecuta pruebas del frontend;
- compila el frontend;
- genera Prisma Client;
- ejecuta pruebas del backend;
- compila el backend.

## Endpoints principales

### Autenticación

```http
POST /api/auth/register
POST /api/auth/login
```

### Canchas

```http
GET /api/canchas
GET /api/canchas/:id/disponibilidad
```

### Reservas

```http
POST /api/reservas
GET /api/reservas/mias
PATCH /api/reservas/:id/cancelar
```

### Administración

```http
POST  /api/admin/canchas
PATCH /api/admin/canchas/:id
PATCH /api/admin/canchas/:id/estado
GET   /api/admin/reservas
PATCH /api/admin/reservas/:id/estado
GET   /api/admin/usuarios
```

## Seguridad

- Autenticación con JWT.
- Contraseñas con bcrypt.
- Middleware de autenticación.
- Autorización por roles.
- Variables de entorno para secretos.
- Validación de horarios y fechas.
- Prevención de reservas superpuestas.
- Rutas administrativas protegidas.

## Despliegue

- Frontend: Render Static Site.
- Backend: Render Web Service.
- Base de datos: PostgreSQL administrado por Render.
- Despliegue automático desde la rama `main`.

## Autor

**José Avalos**  
Ingeniería en Sistemas  
Curso: Programación Web
