import { Link, useLocation } from "react-router-dom";
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

export default function Sidebar({
    isOpen,
    onClose,
}) {
    const location =
        useLocation();

    const user = JSON.parse(
        localStorage.getItem(
            "user"
        ) || "null"
    );

    const p =
        user?.roleId
            ?.permissions || {};

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
            p.activityLogs ||
            0,
            PERMISSIONS.VIEW
        );

    const isOwner =
        user?.roleId?.name ===
        "Owner";

    const isAdminRole =
        user?.roleId
            ?.isAdmin === true;

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
            show:
                !isAdmin,
        },

        {
            name: "Profile",
            path: "/profile",
            show:
                canProfile,
        },

        {
            name: "Company Profile",
            path: "/company-profile",
            show:
                (isOwner ||
                    isAdminRole) &&
                canSettings,
        },

        {
            name: "Settings",
            path: "/settings",
            show:
                (isOwner ||
                    isAdminRole) &&
                canSettings,
        },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    onClick={
                        onClose
                    }
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold">
                        TeamFlow
                    </h1>

                    <button
                        onClick={
                            onClose
                        }
                        className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {menus
                        .filter(
                            (
                                menu
                            ) =>
                                menu.show
                        )
                        .map(
                            (
                                menu
                            ) => (
                                <Link
                                    key={
                                        menu.path
                                    }
                                    to={
                                        menu.path
                                    }
                                    onClick={
                                        onClose
                                    }
                                    className={`flex items-center px-4 py-3 rounded-lg text-sm transition-colors ${location.pathname ===
                                            menu.path
                                            ? "bg-slate-700 text-white font-semibold"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {
                                        menu.name
                                    }
                                </Link>
                            )
                        )}
                </nav>

                {user && (
                    <div className="p-4 border-t border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-800">
                            {user.profileImage ? (
                                <img
                                    src={encodeURI(
                                        user.profileImage.startsWith(
                                            "http"
                                        )
                                            ? user.profileImage
                                            : `http://localhost:6001${user.profileImage}`
                                    )}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold text-slate-300">
                                    {user.name
                                        ? user.name
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase()
                                        : "U"}
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-200 truncate">
                                {
                                    user.name
                                }
                            </p>

                            <p className="text-xs text-slate-500 truncate">
                                {user
                                    .roleId
                                    ?.name ||
                                    "User"}
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );


}
