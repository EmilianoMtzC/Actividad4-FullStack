import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ButtonComponent from "../components/ButtonComponent";
import { buildApiUrl } from "../utils/api";

function DashboardView() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [typeFilterOpen, setTypeFilterOpen] = useState(false);
    const [typeFilter, setTypeFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [form, setForm] = useState({
        type: "income",
        category: "",
        amount: "",
        description: "",
        date: ""
    });

    const fetchTransactions = async () => {
        setError("");
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(buildApiUrl("/api/transactions"), {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });
            const data = await response.json().catch(() => []);
            if (!response.ok) {
                throw new Error(data?.error || data?.message || "Error al cargar transacciones");
            }
            setTransactions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.message || "Error al cargar transacciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        setCreateError("");
        setCreating(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(buildApiUrl("/api/transactions"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify({
                    type: form.type,
                    category: form.category,
                    amount: Number(form.amount),
                    description: form.description,
                    date: form.date
                })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.error || data?.message || "Error al crear transacción");
            }
            setShowForm(false);
            setForm({
                type: "income",
                category: "",
                amount: "",
                description: "",
                date: ""
            });
            await fetchTransactions();
        } catch (err) {
            setCreateError(err?.message || "Error al crear transacción");
        } finally {
            setCreating(false);
        }
    };

    const filteredTransactions =
        typeFilter === "all"
            ? transactions
            : transactions.filter((tx) => tx.type === typeFilter);

    return (
        <div>
            <Navbar />
            <main className="page">
                <div style={{ width: "100%" }}>
                    {/* resto igual */}
                </div>
            </main>
        </div>
    );
}

export default DashboardView;