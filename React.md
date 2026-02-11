# Guía de estudio paso a paso: React desde cero

Objetivo:
Tener una ruta clara para aprender **React** desde lo básico hasta:

- Crear un proyecto y mostrar un "Hola mundo".
- Entender **componentes** (funcionales y de clase).
- Usar **props** y pasar datos entre componentes.
- Trabajar con **estado** y **hooks** (`useState`, `useEffect`).
- Manejar rutas con **React Router**.
- **Consumir una API** desde React.

> Sugerencia: avanza en orden, haciendo mini‑ejemplos en cada sección.

---

## 0. Requisitos previos (antes de React)

Asegúrate de sentirte cómodo con:

- JS moderno (ES6+): `let/const`, funciones flecha, `map`, `filter`, `find`, desestructuración, módulos.
- Promesas y `async/await` para llamadas a APIs.
- NPM, Node.js y la consola.

---

## 1. Crear tu primer proyecto React

Hoy en día se recomienda usar **Vite** para proyectos de ejemplo.

### 1.1. Crear proyecto con Vite

```bash
# Instalar (si no lo tienes)
npm create vite@latest my-react-app -- --template react

cd my-react-app
npm install
npm run dev
```

Abre http://localhost:5173 y verifica que ves la app de ejemplo.

### 1.2. Estructura mínima a entender

`index.html` → punto de entrada.

`src/main.jsx` → donde se "monta" el componente raíz (`<App />`).

`src/App.jsx` → tu primer componente principal.

Haz un "Hola mundo":

```jsx
// src/App.jsx
function App() {
  return <h1>Hola mundo con React</h1>;
}

export default App;
```

## 2. JSX: la "plantilla" de React

Conceptos clave:

- JSX es JS + XML-like, que luego se transforma a llamadas JS.
- Debe devolver un solo elemento raíz.
- Se usan `{}` para insertar expresiones JS.

Ejercicio:

Muestra variables y expresiones:

```jsx
const nombre = "Ada";
const numero = 3;

function App() {
  return (
    <div>
      <h1>Hola, {nombre}</h1>
      <p>El doble de {numero} es {numero * 2}</p>
    </div>
  );
}
```

## 3. Componentes funcionales

React moderno se basa casi por completo en componentes funcionales.

### 3.1. Crear un componente y reutilizarlo

```jsx
// src/components/Saludo.jsx
function Saludo({ nombre }) {
  return <h2>Hola, {nombre}</h2>;
}

export default Saludo;
```

```jsx
// src/App.jsx
import Saludo from "./components/Saludo";

function App() {
  return (
    <div>
      <Saludo nombre="Ada" />
      <Saludo nombre="Alan" />
      <Saludo nombre="Grace" />
    </div>
  );
}

export default App;
```

Puntos a entender:

- Cada componente es una función JS que regresa JSX.
- Puedes tener muchos componentes y anidarlos.

## 4. Componentes de clase (para historial y comprensión)

Aunque hoy casi todo se hace con funciones + hooks, conviene conocer la sintaxis de clase.

```jsx
// src/components/SaludoClase.jsx
class SaludoClase extends React.Component {
  render() {
    return <h2>Hola desde clase, {this.props.nombre}</h2>;
  }
}

export default SaludoClase;
```

```jsx
// src/App.jsx
import SaludoClase from "./components/SaludoClase";

function App() {
  return (
    <div>
      <SaludoClase nombre="Ada" />
    </div>
  );
}
```

Qué aprender aquí:

- Uso de `extends React.Component`.
- `render()` debe devolver JSX.
- Props en clases se acceden con `this.props`.

## 5. Props: pasar datos entre componentes

Concepto central:

- Los props son valores que se pasan de padre a hijo.
- Son de solo lectura dentro del componente hijo.

Ejercicio:

Crea un componente `TarjetaUsuario` que reciba `nombre`, `rol` y `activo`.

Desde App, crea un arreglo de usuarios y haz `.map` para renderizar varias tarjetas.

```jsx
// src/components/TarjetaUsuario.jsx
function TarjetaUsuario({ nombre, rol, activo }) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>Rol: {rol}</p>
      <p>Estado: {activo ? "Activo" : "Inactivo"}</p>
    </div>
  );
}

export default TarjetaUsuario;
```

```jsx
// src/App.jsx
import TarjetaUsuario from "./components/TarjetaUsuario";

const usuarios = [
  { id: 1, nombre: "Ada", rol: "Admin", activo: true },
  { id: 2, nombre: "Alan", rol: "User", activo: false },
];

function App() {
  return (
    <div>
      {usuarios.map((u) => (
        <TarjetaUsuario
          key={u.id}
          nombre={u.nombre}
          rol={u.rol}
          activo={u.activo}
        />
      ))}
    </div>
  );
}
```

## 6. Estado y Hooks básicos (useState, useEffect)

React moderno usa hooks para manejar estado y efectos colaterales.

### 6.1. useState – estado local

Ejercicio: contador.

```jsx
import { useState } from "react";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Valor: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>Incrementar</button>
    </div>
  );
}

export default Contador;
```

Inclúyelo en App y practica:

- Inicializar estado `useState(valorInicial)`.
- Actualizar con la función `setContador`.

### 6.2. useEffect – efectos (por ejemplo, logs, peticiones)

Ejercicio: loguear cuando cambia el contador.

```jsx
import { useState, useEffect } from "react";

function ContadorConEfecto() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    console.log("El contador cambió:", contador);
  }, [contador]); // dependencia

  return (
    <div>
      <p>Valor: {contador}</p>
      <button onClick={() => setContador((c) => c + 1)}>Incrementar</button>
    </div>
  );
}

export default ContadorConEfecto;
```

Entiende:

- El segundo argumento (`[contador]`) indica cuándo se ejecuta el efecto.
- Si está vacío `[]`, se ejecuta una vez al montar.

## 7. Eventos, formularios y lifting state up

Ejercicio:

Crea un input controlado (valor en el estado).

Muestra lo escrito debajo.

Luego pasa ese valor a un componente hijo como prop.

```jsx
// src/App.jsx
import { useState } from "react";
import MostrarTexto from "./components/MostrarTexto";

function App() {
  const [texto, setTexto] = useState("");

  return (
    <div>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe algo"
      />
      <MostrarTexto texto={texto} />
    </div>
  );
}

export default App;
```

```jsx
// src/components/MostrarTexto.jsx
function MostrarTexto({ texto }) {
  return <p>Texto actual: {texto}</p>;
}

export default MostrarTexto;
```

Conceptos:

- Componentes controlados (valor proveniente de state).
- Pasar estado hacia abajo con props ("lifting state up").

## 8. React Router: navegación entre pantallas

Usaremos React Router v6.

### 8.1. Instalación

```bash
npm install react-router-dom
```

### 8.2. Configuración básica

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2>Inicio</h2>;
}

function About() {
  return <h2>Acerca de</h2>;
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/about">Acerca de</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
```

Practica:

- Rutas con parámetros (`/users/:id`).
- Uso de `useParams` para leer parámetros.

## 9. Consumir una API en React

Usarás `fetch` o `axios` dentro de `useEffect`.

Ejercicio: consumir https://jsonplaceholder.typicode.com/posts.

```bash
# opcional
npm install axios
```

### 9.1. Ejemplo con fetch

```jsx
import { useState, useEffect } from "react";

function ListaPosts() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarPosts() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!res.ok) throw new Error("Error al cargar posts");
        const data = await res.json();
        setPosts(data.slice(0, 10)); // primeros 10
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarPosts();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

export default ListaPosts;
```

Incluye `ListaPosts` en una ruta o en App.

Practica:

- Manejar loading / error.
- Pasar un `postId` como prop para mostrar detalles.
