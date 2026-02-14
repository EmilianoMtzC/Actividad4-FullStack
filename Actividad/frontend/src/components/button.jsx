function ButtonComponent({ text, onClick }) {
    const buttonStyle = {
        backgroundColor: "#5D5D5D", // Gris oscuro de tu captura
        color: "white",
        border: "none",
        borderRadius: "20px",    // Forma de cápsula
        padding: "6px 14px",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "0.9rem"
    };

    return (
        <button style={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
}

export default ButtonComponent;