import { useEffect, useState } from "react";
import { getDashboardStats } from "@/modules/services/dashboardService";

// ── Dynamic helpers ───────────────────────────────────────────────────────────

// Auto-generate a consistent color from any string (role, action, etc.)
function stringToColor(str = "") {
    const palette = [
        { bg: "#eef2ff", color: "#4f46e5" },
        { bg: "#f5f3ff", color: "#7c3aed" },
        { bg: "#ecfeff", color: "#0891b2" },
        { bg: "#f0fdf4", color: "#16a34a" },
        { bg: "#fffbeb", color: "#d97706" },
        { bg: "#fef2f2", color: "#dc2626" },
        { bg: "#fdf4ff", color: "#a21caf" },
        { bg: "#fff7ed", color: "#ea580c" },
        { bg: "#f0f9ff", color: "#0369a1" },
        { bg: "#f1f5f9", color: "#475569" },
    ];
    const index =
        str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
        palette.length;
    return palette[index];
}

// Auto-pick an icon from any action string
function actionToIcon(action = "") {
    const a = action.toLowerCase();
    if (a.includes("login")) return "🔐";
    if (a.includes("logout")) return "🚪";
    if (a.includes("create") && a.includes("user")) return "👤";
    if (a.includes("create")) return "➕";
    if (a.includes("delete") || a.includes("deactivate")) return "🗑️";
    if (a.includes("update") && a.includes("role")) return "🛡️";
    if (a.includes("update")) return "✏️";
    if (a.includes("approve")) return "✅";
    if (a.includes("reject")) return "❌";
    if (a.includes("leave")) return "📅";
    if (a.includes("payroll")) return "💰";
    if (a.includes("report")) return "📊";
    if (a.includes("tenant")) return "🏢";
    if (a.includes("password")) return "🔑";
    if (a.includes("export")) return "📤";
    if (a.includes("import")) return "📥";
    return "📋";
}

// Format action string to readable label: "UPDATE_USER_ROLE" → "Update User Role"
function formatAction(action = "") {
    return action
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Format role string to readable label: "org_admin" → "Org Admin"
function formatRole(role = "") {
    return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Stat card accent colors — cycles through palette by index
const ACCENT_COLORS = [
    "#6366f1", "#7c3aed", "#16a34a", "#d97706",
    "#0891b2", "#dc2626", "#a21caf", "#ea580c",
];

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ title, value, icon, accent }) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 14,
            padding: "1.4rem 1.5rem",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            position: "relative",
            overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", top: 0, left: 0,
                width: 4, height: "100%",
                background: accent,
                borderRadius: "14px 0 0 14px",
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{title}</span>
                {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
            </div>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#111827", lineHeight: 1 }}>
                {value ?? "—"}
            </p>
        </div>
    );
}

function Badge({ label, bg, color }) {
    return (
        <span style={{
            fontSize: 11, fontWeight: 600,
            padding: "2px 9px", borderRadius: 20,
            background: bg, color,
            whiteSpace: "nowrap",
        }}>
            {label}
        </span>
    );
}

function ActivityItem({ activity }) {
    const action = activity.action || "";
    const actionMeta = stringToColor(action);
    const roleMeta = stringToColor(activity.userRole || "");

    return (
        <div style={{
            display: "flex", alignItems: "flex-start", gap: "0.9rem",
            padding: "0.85rem 0",
            borderBottom: "1px solid #f3f4f6",
        }}>
            <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: actionMeta.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17,
            }}>
                {actionToIcon(action)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                    {action && (
                        <Badge
                            label={formatAction(action)}
                            bg={actionMeta.bg}
                            color={actionMeta.color}
                        />
                    )}
                    {activity.userRole && (
                        <Badge
                            label={formatRole(activity.userRole)}
                            bg={roleMeta.bg}
                            color={roleMeta.color}
                        />
                    )}
                </div>
                <p style={{ fontSize: 13, color: "#374151", marginTop: 4, fontWeight: 500 }}>
                    {activity.description || formatAction(action) || "Action performed"}
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                    by{" "}
                    <span style={{ color: "#6b7280", fontWeight: 500 }}>
                        {activity.userName || "Unknown"}
                    </span>
                    {activity.tenantName && (
                        <> · <span style={{ color: "#6b7280" }}>{activity.tenantName}</span></>
                    )}
                </p>
            </div>

            <span style={{
                fontSize: 12, color: "#9ca3af",
                flexShrink: 0, paddingTop: 2,
                whiteSpace: "nowrap",
            }}>
                {timeAgo(activity.createdAt)}
            </span>
        </div>
    );
}

function EmptyState() {
    return (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>📭</div>
            <p style={{ fontWeight: 500, color: "#6b7280" }}>No activity yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                Actions taken by your team will appear here.
            </p>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div style={{
            background: "#fff", borderRadius: 14, padding: "1.4rem 1.5rem",
            border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
            <div style={{ height: 13, width: "55%", background: "#f3f4f6", borderRadius: 6, marginBottom: 16 }} />
            <div style={{ height: 36, width: "40%", background: "#f3f4f6", borderRadius: 6 }} />
        </div>
    );
}

function SkeletonActivity() {
    return (
        <div style={{ display: "flex", gap: "0.9rem", padding: "0.85rem 0", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f3f4f6", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div style={{ height: 12, width: "30%", background: "#f3f4f6", borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 12, width: "60%", background: "#f3f4f6", borderRadius: 6 }} />
            </div>
        </div>
    );
}

// ── Derive stat cards dynamically from API response ───────────────────────────
// Supports two API shapes:
//   Shape 1: { stats: [{ title, value, icon? }] }   ← explicit array (preferred)
//   Shape 2: { totalUsers, totalRoles, activeUsers } ← flat object (auto-detected)
function deriveStats(data) {
    if (!data) return [];

    // Shape 1: API returns a stats array directly
    if (Array.isArray(data.stats)) return data.stats;

    // Shape 2: flat object — pick all numeric keys, skip non-stat keys
    const SKIP = new Set(["recentActivities", "stats", "success", "__v"]);
    return Object.entries(data)
        .filter(([key, val]) => !SKIP.has(key) && typeof val === "number")
        .map(([key, value]) => ({
            title: key
                .replace(/([A-Z])/g, " $1")
                .replace(/\b\w/g, (c) => c.toUpperCase())
                .trim(),
            value,
        }));
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchDashboard(); }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await getDashboardStats();
            if (data.success) setDashboard(data.data);
            else setError("Failed to load dashboard data.");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    const stats = deriveStats(dashboard);
    const activities = dashboard?.recentActivities || [];

    return (
        <div style={{ padding: "2rem 1.75rem", maxWidth: 1100, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
                    Overview of your organisation
                </p>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    color: "#b91c1c", padding: "0.75rem 1rem",
                    borderRadius: 10, marginBottom: "1.5rem", fontSize: 14,
                }}>
                    {error}
                </div>
            )}

            {/* Stat cards — fully dynamic */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
            }}>
                {loading
                    ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
                    : stats.map((stat, i) => (
                        <StatCard
                            key={stat.title || i}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            accent={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                        />
                    ))
                }
            </div>

            {/* Activity feed — fully dynamic */}
            <div style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                overflow: "hidden",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.1rem 1.4rem",
                    borderBottom: "1px solid #f3f4f6",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                            Recent Activity
                        </h2>
                    </div>
                    {!loading && activities.length > 0 && (
                        <span style={{
                            fontSize: 12, color: "#6b7280",
                            background: "#f9fafb", border: "1px solid #e5e7eb",
                            padding: "3px 10px", borderRadius: 20,
                        }}>
                            {activities.length} events
                        </span>
                    )}
                </div>

                <div style={{ padding: "0 1.4rem" }}>
                    {loading
                        ? [1, 2, 3].map((i) => <SkeletonActivity key={i} />)
                        : activities.length > 0
                            ? activities.map((activity) => (
                                <ActivityItem key={activity._id} activity={activity} />
                            ))
                            : <EmptyState />
                    }
                </div>
            </div>
        </div>
    );
}