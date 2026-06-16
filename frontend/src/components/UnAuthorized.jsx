import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const p = user?.roleId?.permissions || {};
    const isAdmin = p?.users?.view === true || p?.roles?.view === true;

    return (
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
            <div style={{ fontSize: 52 }}>🚫</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: "1rem", color: "#111827" }}>
                403 — Access Denied
            </h2>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 14 }}>
                Your role (<strong>{user?.roleId?.name || "Unknown"}</strong>) doesn't have permission to view this page.
            </p>
            <button
                onClick={() => navigate(isAdmin ? "/dashboard" : "/my-dashboard", { replace: true })}
                style={{
                    marginTop: "1.5rem", padding: "0.6rem 1.4rem",
                    background: "#4f46e5", color: "#fff",
                    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14,
                }}
            >
                ← Back to Dashboard
            </button>
        </div>
    );
}