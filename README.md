# Actividad 4 — FullStack (Backend + Frontend)

Aplicación fullstack para **registro/login** con **JWT** y gestión de **transacciones** (ingresos/gastos) usando **React (Vite)** en el frontend y **Node.js + Express** en el backend con **MySQL (Railway)**.

---

## 1) Backend (Node.js + Express + MySQL)

**Ubicación:** [`Actividad/backend/`](Actividad/backend/:1)

### 1.1 Tecnologías

- **Express** (API REST)
- **mysql2/promise** (pool de conexiones)
- **jsonwebtoken** (JWT)
- **bcrypt** (hash de contraseñas)
- **cors** + **dotenv**

Dependencias y scripts en [`Actividad/backend/package.json`](Actividad/backend/package.json:1).

### 1.2 Variables de entorno

El backend usa variables definidas en [`Actividad/backend/.env`](Actividad/backend/.env:1):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: conexión a MySQL.
- `JWT_SECRET`: clave para firmar/verificar el token.
- `PORT` (opcional): puerto del servidor (Railway suele inyectarlo). Por defecto usa `3000`.

### 1.3 Conexión a base de datos

Se crea un **pool** MySQL en [`Actividad/backend/src/config/db.js`](Actividad/backend/src/config/db.js:1) usando `mysql2/promise`.

Puntos importantes:

- `decimalNumbers: true` ayuda a recibir decimales como número en JS.
- `ssl: { rejectUnauthorized: false }` está configurado para entornos tipo Railway.

### 1.4 Arranque del servidor y middlewares

El servidor se levanta en [`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:1).

Incluye:

- `cors` limitado a `http://localhost:5173` (frontend en Vite).
- `express.json()` para parsear JSON.
- Ruta healthcheck:
  - `GET /` → responde texto “API funcionando”.

Además, al iniciar intenta obtener una conexión del pool para confirmar DB disponible.

### 1.5 Autenticación (JWT)

El middleware de protección está en [`Actividad/backend/src/middlewares/auth.js`](Actividad/backend/src/middlewares/auth.js:1).

Cómo funciona:

1. Lee el header: `Authorization: Bearer <token>`.
2. Si no existe o no inicia con `Bearer`, responde `401`.
3. Verifica el token con `JWT_SECRET`.
4. Si es válido, guarda el payload en `req.user` y llama `next()`.

### 1.6 Rutas de Auth (registro y login)

Definidas en [`Actividad/backend/src/routes/auth.routes.js`](Actividad/backend/src/routes/auth.routes.js:1) y montadas bajo `/api/auth`.

#### POST `/api/auth/register`

Registra un usuario:

- Body JSON:
  - `name`: string
  - `email`: string
  - `password`: string

Proceso:

- Hashea `password` con bcrypt.
- Inserta en tabla `users (name, email, password)`.
- Si el email ya existe (error `ER_DUP_ENTRY`), responde `409`.

Respuesta esperada:

- `201` `{ "message": "Usuario registrado", "userId": <id> }`

#### POST `/api/auth/login`

Inicia sesión:

- Body JSON:
  - `username`: email (el frontend manda el email como `username`)
  - `password`: string

Proceso:

- Busca usuario por `email`.
- Compara password con el hash.
- Si es correcto, firma JWT con `{ userId: user.id }` y expira en `1h`.

Respuesta esperada:

- `200` `{ "message": "Login correcto", "token": "..." }`

### 1.7 Rutas de Transacciones (CRUD básico)

Rutas definidas en [`Actividad/backend/src/routes/transaction.routes.js`](Actividad/backend/src/routes/transaction.routes.js:1) y montadas bajo `/api/transactions`.

Todas las rutas están protegidas por JWT (middleware `auth`).

#### POST `/api/transactions`

Crea una transacción.

- Header:
  - `Authorization: Bearer <token>`
- Body JSON:
  - `type`: `income` | `expense`
  - `category`: string
  - `amount`: number
  - `description`: string (opcional)
  - `date`: string (formato `YYYY-MM-DD`)

Implementación:

- Controlador: [`Actividad/backend/src/controllers/transactions.controller.js`](Actividad/backend/src/controllers/transactions.controller.js:1)
- Modelo/DB: [`Actividad/backend/src/models/transaction.model.js`](Actividad/backend/src/models/transaction.model.js:1)

Nota: el usuario se toma desde `req.user.id || req.user.userId` (compatibilidad por cómo se firma el token).

Respuesta esperada:

- `201` `{ "id": <transactionId> }`

#### GET `/api/transactions`

Lista transacciones del usuario autenticado (ordenadas por fecha descendente).

- Header:
  - `Authorization: Bearer <token>`

Respuesta esperada:

- `200` `[{ id, user_id, type, category, amount, description, date }, ...]`

#### DELETE `/api/transactions/:id`

Elimina una transacción por id **si pertenece al usuario autenticado**.

- Header:
  - `Authorization: Bearer <token>`

Respuestas típicas:

- `200` `{ "message": "Transacción eliminada correctamente" }`
- `404` `{ "message": "Transacción no encontrada o no autorizada" }`

### 1.8 Ruta protegida de ejemplo

En [`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:1) existe una ruta protegida adicional:

- `GET /api/mis-transacciones` (requiere Bearer token)

Esta hace un `SELECT * FROM transactions WHERE user_id = ?` usando el id del token.

### 1.9 (Referencia) Esquema de tablas esperado

Por el código, la DB espera al menos:

**Tabla `users`**

- `id` (PK, autoincrement)
- `name` (string)
- `email` (string, único)
- `password` (string, hash)

**Tabla `transactions`**

- `id` (PK, autoincrement)
- `user_id` (FK a users.id)
- `type` (`income`/`expense`)
- `category` (string)
- `amount` (decimal/float)
- `description` (string)
- `date` (date/datetime)

### 1.10 Ejecución local (Backend)

Desde [`Actividad/backend/`](Actividad/backend/:1):

```bash
npm install
npm run dev
```

Servidor por defecto en `http://localhost:3000`.

---

## 2) Frontend (React + Vite)

**Ubicación:** [`Actividad/frontend/`](Actividad/frontend/:1)

### 2.1 Tecnologías

- **React**
- **React Router**
- **Vite**
- Fetch API (requests)

### 2.2 Variables de entorno

Configuración en [`Actividad/frontend/.env`](Actividad/frontend/.env:1):

- `VITE_API_URL=http://localhost:3000`

El frontend construye las URLs así:

- `baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"`

### 2.3 Punto de entrada

El render principal se realiza en [`Actividad/frontend/src/main.jsx`](Actividad/frontend/src/main.jsx:1) montando el componente principal `App`.

### 2.4 Ruteo y vistas

El ruteo está en [`Actividad/frontend/src/App.jsx`](Actividad/frontend/src/App.jsx:1) usando `react-router-dom`:

- `/` redirige a `/login`
- `/login` → pantalla de login
- `/register` → pantalla de registro
- `/dashboard` → panel con tabla de transacciones y modal para crear nuevas

### 2.5 Login

Pantalla en [`Actividad/frontend/src/pages/Login.jsx`](Actividad/frontend/src/pages/Login.jsx:1).

Características:

- Form con `email` y `password`.
- Al pulsar el botón de login se llama a `/api/auth/login`.
- Si la respuesta incluye `token`, se guarda en `localStorage`.
- Navega a `/dashboard`.

Importante: el body que envía el frontend es:

```json
{ "username": "<email>", "password": "<password>" }
```

Esto coincide con lo esperado por el backend en el login.

### 2.6 Registro

Pantalla en [`Actividad/frontend/src/pages/Register.jsx`](Actividad/frontend/src/pages/Register.jsx:1).

Características:

- Envía `name`, `email`, `password` a `/api/auth/register`.
- Si registra correctamente, navega a `/login`.

### 2.7 Dashboard (transacciones)

El dashboard se implementa como vista interna en [`Actividad/frontend/src/App.jsx`](Actividad/frontend/src/App.jsx:1) (componente `DashboardView`).

Qué hace:

- Al montar (`useEffect`) ejecuta `GET /api/transactions`.
- Envía `Authorization: Bearer <token>` con el token de `localStorage`.
- Muestra una tabla con transacciones.
- Permite filtrar por tipo (`income`, `expense`, `all`).
- Abre un modal para crear una transacción.
- Al crear, ejecuta `POST /api/transactions` y luego recarga la lista.

### 2.8 Componentes reutilizables

- Botón con soporte para llamadas API: [`Actividad/frontend/src/components/button.jsx`](Actividad/frontend/src/components/button.jsx:1)
  - Si se pasa `api={...}`, realiza fetch con `path`, `method`, `auth`, `body`, callbacks `onSuccess/onError`.
  - Si `auth: true`, agrega `Authorization` con el token de `localStorage`.

- Input genérico: [`Actividad/frontend/src/components/Input.jsx`](Actividad/frontend/src/components/Input.jsx:1)

- Navbar + logout (borra token): [`Actividad/frontend/src/components/Navbar.jsx`](Actividad/frontend/src/components/Navbar.jsx:1)

### 2.9 Ejecución local (Frontend)

Desde [`Actividad/frontend/`](Actividad/frontend/:1):

```bash
npm install
npm run dev
```

Vite normalmente levanta en `http://localhost:5173`.

---

## 3) Pruebas en Postman (colección sugerida)

Puedes probar el API con **Postman** o también con el archivo [`pruebas_api.http`](pruebas_api.http:1) (si usas la extensión *REST Client* en VSCode).

### 3.1 Variables recomendadas en Postman

En tu Environment de Postman define:

- `baseUrl` = `http://localhost:3000`
- `token` = *(vacío al inicio)*

### 3.2 Auth — Register

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "name": "Usuario Demo",
  "email": "demo@test.com",
  "password": "123"
}
```

**Respuestas esperadas**

- `201` usuario creado
- `409` si el correo ya existe

### 3.3 Auth — Login (guardar token)

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "username": "demo@test.com",
  "password": "123"
}
```

**Test Script (Postman) — guardar token en variable**

En la pestaña **Tests**:

```javascript
const json = pm.response.json();
pm.environment.set('token', json.token);
```

### 3.4 Transactions — Get

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/transactions`
- Authorization: Bearer Token → `{{token}}`

### 3.5 Transactions — Create

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/transactions`
- Authorization: Bearer Token → `{{token}}`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "type": "income",
  "category": "comida",
  "amount": 25.50,
  "description": "Almuerzo en la facultad",
  "date": "2026-02-13"
}
```

### 3.6 Transactions — Delete

**Request**

- Method: `DELETE`
- URL: `{{baseUrl}}/api/transactions/2`
- Authorization: Bearer Token → `{{token}}`

### 3.7 Ruta protegida extra — Mis transacciones

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/mis-transacciones`
- Authorization: Bearer Token → `{{token}}`

---

## 4) Imágenes / Capturas (Screenshots)

Agrega aquí tus evidencias (capturas) al final del README.

- Login
  - ![Login](docs/screenshots/login.png)
- Register
  - ![Register](docs/screenshots/register.png)
- Dashboard (tabla)
  - ![Dashboard](docs/screenshots/dashboard.png)
- Postman (login + token)
  - ![Postman Login](docs/screenshots/postman-login.png)
- Postman (create/get/delete)
  - ![Postman Transactions](docs/screenshots/postman-transactions.png)
