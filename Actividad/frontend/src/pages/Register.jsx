import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";
import ButtonComponent from "../components/button.jsx";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
    };

    return (
        <div className="login-screen">
            <form className="login-card signup-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Sign up</h1>
                <Input
                    className="login-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <Input
                    className="login-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <Input
                    className="login-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                {error ? <div className="input-error">{error}</div> : null}
                <ButtonComponent
                    className="login-button"
                    text="Sign up"
                    type="button"
                    onClick={handleSubmit}
                    api={{
                        path: "/api/auth/register",
                        method: "POST",
                        auth: false,
                        body: () => ({
                            name: form.name,
                            email: form.email,
                            password: form.password
                        }),
                        onSuccess: () => {
                            navigate("/login");
                        },
                        onError: (err) => {
                            setError(err?.message || "Error en registro");
                        }
                    }}
                    style={{ backgroundColor: "#6A6A6A", padding: "8px 30px" }}
                />
                <button
                    className="login-link"
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Login with an account
                </button>
            </form>
        </div>
    );
}

export default Register;
