import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const p = user?.roleId?.permissions || {};

    // ── Admin = has ANY management permission ─────────────────────────────────
    const isAdmin =
        p?.users?.view === true ||
        p?.roles?.view === true ||
        p?.settings?.view === true;

    // ── Menu definitions — show is driven entirely by permissions ─────────────
    const menus = [
        // Admin dashboard (org stats, all activity)
        {
            name: "Dashboard",
            path: "/dashboard",
            show: isAdmin && p?.dashboard?.view === true,
        },
        // User dashboard (personal stats, my activity)
        {
            name: "Dashboard",
            path: "/my-dashboard",
            show: !isAdmin && p?.dashboard?.view === true,
        },
        {
            name: "Users",
            path: "/users",
            show: p?.users?.view === true,
        },
        {
            name: "Roles",
            path: "/roles",
            show: p?.roles?.view === true,
        },
        // Admins see full org activity log
        {
            name: "Activity Logs",
            path: "/activities",
            show: isAdmin && (p?.users?.view === true || p?.roles?.view === true),
        },
        // Regular users see only their own activity
        {
            name: "My Activity",
            path: "/my-activity",
            show: !isAdmin,
        },
        {
            name: "Profile",
            path: "/profile",
            show: p?.profile?.view === true,
        },
        {
            name: "Settings",
            path: "/settings",
            show: p?.settings?.view === true,
        },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold">TeamFlow</h1>
            </div>

            <nav className="p-4 space-y-1 flex-1">
                {menus
                    .filter((m) => m.show)
                    .map((menu) => (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm transition-colors ${location.pathname === menu.path
                                    ? "bg-slate-700 text-white font-semibold"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            {menu.name}
                        </Link>
                    ))}
            </nav>

            {/* User info at bottom */}
            {user && (
                <div className="p-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.roleId?.name || "User"}</p>
                </div>
            )}
        </aside>
    );
}