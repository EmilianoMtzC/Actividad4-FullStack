function TarjetaUsuario({ nombre, rol, activo }) {
    return (
        <div>
            <h3>{nombre}</h3>
            <p>{rol}</p>
            <p>{activo ? "Activo" : "Inactivo"}</p>
        </div>
    );
}

export default TarjetaUsuario;