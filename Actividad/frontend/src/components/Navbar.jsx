import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo"></div>
            <div className="profile-menu">
                <button
                    className="profile"
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                />
                {open ? (
                    <div className="profile-dropdown">
                        <button className="profile-item" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : null}
            </div>
        </nav>
    );
}

export default Navbar;
