import { Link, useLocation } from "react-router-dom";
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

export default function Sidebar() {
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const p =
        user?.roleId?.permissions || {};

    const canDashboard =
        hasPermission(
            p.dashboard || 0,
            PERMISSIONS.VIEW
        );

    const canUsers =
        hasPermission(
            p.users || 0,
            PERMISSIONS.VIEW
        );

    const canRoles =
        hasPermission(
            p.roles || 0,
            PERMISSIONS.VIEW
        );

    const canProfile =
        hasPermission(
            p.profile || 0,
            PERMISSIONS.VIEW
        );

    const canSettings =
        hasPermission(
            p.settings || 0,
            PERMISSIONS.VIEW
        );

    const canActivityLogs =
        hasPermission(
            p.activityLogs || 0,
            PERMISSIONS.VIEW
        );

    const isAdmin =
        canUsers ||
        canRoles ||
        canSettings;

    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard",
            show:
                isAdmin &&
                canDashboard,
        },

        {
            name: "Dashboard",
            path: "/my-dashboard",
            show:
                !isAdmin &&
                canDashboard,
        },

        {
            name: "Users",
            path: "/users",
            show: canUsers,
        },

        {
            name: "Roles",
            path: "/roles",
            show: canRoles,
        },

        {
            name: "Activity Logs",
            path: "/activities",
            show:
                isAdmin &&
                canActivityLogs,
        },

        {
            name: "My Activity",
            path: "/my-activity",
            show: !isAdmin,
        },

        {
            name: "Profile",
            path: "/profile",
            show: canProfile,
        },

        {
            name: "Settings",
            path: "/settings",
            show: canSettings,
        },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold">
                    TeamFlow
                </h1>
            </div>

            <nav className="p-4 space-y-1 flex-1">
                {menus
                    .filter(
                        (menu) => menu.show
                    )
                    .map((menu) => (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`flex items-center px-4 py-3 rounded-lg text-sm transition-colors ${location.pathname ===
                                    menu.path
                                    ? "bg-slate-700 text-white font-semibold"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            {menu.name}
                        </Link>
                    ))}
            </nav>

            {user && (
                <div className="p-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 truncate">
                        {user.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                        {user.roleId?.name ||
                            "User"}
                    </p>
                </div>
            )}
        </aside>
    );
}