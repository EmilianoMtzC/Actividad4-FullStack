import TarjetaUsuario from "./components/TarjetaUsuario.jsx";

const usuarios = [
    { id: 1, nombre: 'Juan', rol: 'admin', activo: true},
    { id: 2, nombre: 'Pedro', rol: 'usuario', activo: false}
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