import { useState } from "react";
import "./styles/style.css";
import LoginView from "./pages/Login.jsx";
import SignupView from "./pages/Register.jsx";
import DashboardView from "./pages/DashboardView.jsx";

function App() {

    const [view, setView] = useState(() => {
        return localStorage.getItem("token") ? "dashboard" : "login";
    });

    if (view === "login") {
        return (
            <LoginView
                onSuccess={() => setView("dashboard")}
                onSignup={() => setView("signup")}
            />
        );
    }

    if (view === "signup") {
        return (
            <SignupView
                onSuccess={() => setView("dashboard")}
                onLogin={() => setView("login")}
            />
        );
    }

    return <DashboardView />;
}

export default App;