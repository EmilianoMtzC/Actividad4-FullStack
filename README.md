
# Actividad 4 — Full Stack (Auth + Transactions)

Aplicación full stack con autenticación por JWT y CRUD de transacciones (ingresos/egresos).

## Explicación Backend

**Ubicación:** [`Actividad/backend`](Actividad/backend:1)

### Stack

- Node.js + Express ([`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:1))
- JWT (middleware de autorización) ([`Actividad/backend/src/middlewares/auth.js`](Actividad/backend/src/middlewares/auth.js:1))
- MySQL (pool con `mysql2/promise`) ([`Actividad/backend/src/config/db.js`](Actividad/backend/src/config/db.js:1))

### Instalación y ejecución

1) Instalar dependencias:

```bash
cd Actividad/backend
npm install
```

2) Configurar variables de entorno.

El backend carga variables desde `.env` (ver [`Actividad/backend/.env`](Actividad/backend/.env:1)). **Recomendación:** no publiques credenciales reales; usa un `.env.example` en repos.

Ejemplo:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password
DB_NAME=tu_db

JWT_SECRET=tu_secreto
```

3) Levantar el servidor:

```bash
npm run dev
```

Scripts disponibles en [`Actividad/backend/package.json`](Actividad/backend/package.json:1):

- `npm run dev` (nodemon)
- `npm start`

### Rutas principales (API)

La app monta rutas bajo `/api` (ver [`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:21)).

#### Salud

- `GET /` → responde un texto confirmando que la API está activa ([`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:24)).

#### Auth

Definidas en [`Actividad/backend/src/routes/auth.routes.js`](Actividad/backend/src/routes/auth.routes.js:1).

- `POST /api/auth/register`
  - Body (JSON):
    ```json
    {
      "name": "Tu nombre",
      "email": "correo@dominio.com",
      "password": "123456"
    }
    ```
  - Respuesta (201):
    ```json
    { "message": "Usuario registrado", "userId": 1 }
    ```

- `POST /api/auth/login`
  - Nota: el backend espera `username` (que corresponde al email) y `password` ([`Actividad/backend/src/routes/auth.routes.js`](Actividad/backend/src/routes/auth.routes.js:36)).
  - Body (JSON):
    ```json
    {
      "username": "correo@dominio.com",
      "password": "123456"
    }
    ```
  - Respuesta (200):
    ```json
    { "message": "Login correcto", "token": "<JWT>" }
    ```

#### Transactions (protegidas con JWT)

Definidas en [`Actividad/backend/src/routes/transaction.routes.js`](Actividad/backend/src/routes/transaction.routes.js:1).

**Header requerido (todas):**

```http
Authorization: Bearer <JWT>
```

- `GET /api/transactions`
  - Respuesta (200): arreglo de transacciones del usuario autenticado.

- `POST /api/transactions`
  - Body (JSON):
    ```json
    {
      "type": "income",
      "category": "Salary",
      "amount": 2500,
      "description": "Pago quincenal",
      "date": "2026-02-14"
    }
    ```
  - Respuesta (201):
    ```json
    { "id": 10 }
    ```

- `DELETE /api/transactions/:id`
  - Respuesta (200):
    ```json
    { "message": "Transacción eliminada correctamente" }
    ```

#### Endpoint extra protegido

En [`Actividad/backend/src/server.js`](Actividad/backend/src/server.js:34) existe:

- `GET /api/mis-transacciones`
  - Retorna `{ msg, data }` con las transacciones del usuario del token.

### Base de datos (estructura esperada)

No hay scripts SQL en el repo; por el uso en consultas se asume:

- Tabla `users` con columnas al menos: `id`, `name`, `email`, `password` ([`Actividad/backend/src/routes/auth.routes.js`](Actividad/backend/src/routes/auth.routes.js:22)).
- Tabla `transactions` con columnas al menos: `id`, `user_id`, `type`, `category`, `amount`, `description`, `date` ([`Actividad/backend/src/models/transaction.model.js`](Actividad/backend/src/models/transaction.model.js:6)).

## Explicación Frontend

**Ubicación:** [`Actividad/frontend`](Actividad/frontend:1)

### Stack

- React + Vite ([`Actividad/frontend/package.json`](Actividad/frontend/package.json:1))
- React Router ([`Actividad/frontend/src/App.jsx`](Actividad/frontend/src/App.jsx:1))

### Instalación y ejecución

1) Instalar dependencias:

```bash
cd Actividad/frontend
npm install
```

2) Configurar variable de entorno para apuntar al backend.

El frontend usa `VITE_API_URL` y por defecto cae a `http://localhost:3000` ([`Actividad/frontend/src/App.jsx`](Actividad/frontend/src/App.jsx:30)).

Ejemplo `.env` (en [`Actividad/frontend`](Actividad/frontend:1)):

```env
VITE_API_URL=http://localhost:3000
```

3) Levantar el frontend:

```bash
npm run dev
```

### Flujo de la app

- Registro: manda `name/email/password` a `/api/auth/register` ([`Actividad/frontend/src/pages/Register.jsx`](Actividad/frontend/src/pages/Register.jsx:56)).
- Login: manda `username/password` a `/api/auth/login` y guarda el JWT en `localStorage` ([`Actividad/frontend/src/pages/Login.jsx`](Actividad/frontend/src/pages/Login.jsx:46)).
- Dashboard: consume transacciones con `Authorization: Bearer <token>` ([`Actividad/frontend/src/App.jsx`](Actividad/frontend/src/App.jsx:26)).
- Logout: elimina `token` de `localStorage` ([`Actividad/frontend/src/components/Navbar.jsx`](Actividad/frontend/src/components/Navbar.jsx:8)).

## Pruebas Postman

### 1) Crear Environment

Variables sugeridas:

- `baseUrl` = `http://localhost:3000`
- `token` = *(vacío al inicio)*

### 2) Register

**Request**

- Método: `POST`
- URL: `{{baseUrl}}/api/auth/register`
- Body → raw → JSON:

```json
{
  "name": "Demo",
  "email": "demo@correo.com",
  "password": "123456"
}
```

### 3) Login (guardar token automáticamente)

**Request**

- Método: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Body → raw → JSON:

```json
{
  "username": "demo@correo.com",
  "password": "123456"
}
```

**Tests (pestaña “Tests” en Postman)**

```js
const json = pm.response.json();
pm.environment.set('token', json.token);
```

### 4) Listar transacciones

- Método: `GET`
- URL: `{{baseUrl}}/api/transactions`
- Headers:
  - `Authorization` = `Bearer {{token}}`

### 5) Crear transacción

- Método: `POST`
- URL: `{{baseUrl}}/api/transactions`
- Headers:
  - `Authorization` = `Bearer {{token}}`
  - `Content-Type` = `application/json`
- Body → raw → JSON:

```json
{
  "type": "expense",
  "category": "Food",
  "amount": 120,
  "description": "Comida",
  "date": "2026-02-14"
}
```

### 6) Eliminar transacción

- Método: `DELETE`
- URL: `{{baseUrl}}/api/transactions/ID_A_ELIMINAR`
- Headers:
  - `Authorization` = `Bearer {{token}}`

### 7) Endpoint extra: mis transacciones

- Método: `GET`
- URL: `{{baseUrl}}/api/mis-transacciones`
- Headers:
  - `Authorization` = `Bearer {{token}}`

## Sección de imágenes

Coloca evidencias (capturas) en una carpeta `images/` y referéncialas aquí.

Ejemplo de estructura:

```
images/
  01-login.png
  02-dashboard.png
  03-postman-login.png
  04-postman-transactions.png
```

Ejemplos de inserción:

- Login:
  - `![Login](images/01-login.png)`
- Dashboard:
  - `![Dashboard](images/02-dashboard.png)`
- Postman:
  - `![Postman Login](images/03-postman-login.png)`
  - `![Postman Transactions](images/04-postman-transactions.png)`
