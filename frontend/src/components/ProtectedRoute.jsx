import { Navigate } from "react-router-dom";
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

export default function ProtectedRoute({
    children,
    resource,
    action = "view",
}) {
    const token =
        localStorage.getItem(
            "token"
        );


    const user = JSON.parse(
        localStorage.getItem(
            "user"
        ) || "null"
    );

    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!resource) {
        return children;
    }

    const permissions =
        user?.roleId
            ?.permissions || {};

    const isAdmin =
        user?.roleId
            ?.isAdmin === true;

    const isOwner =
        user?.roleId?.name ===
        "Owner";

    if (
        resource ===
        "adminOnly"
    ) {
        return isAdmin
            ? children
            : (
                <Navigate
                    to="/my-dashboard"
                    replace
                />
            );
    }

    // Settings & Company Profile
    // Only Owner/Admin allowed
    if (
        resource ===
        "settings"
    ) {
        if (
            !isOwner &&
            !isAdmin
        ) {
            return (
                <Navigate
                    to="/my-dashboard"
                    replace
                />
            );
        }

        return children;
    }

    const value =
        permissions[
        resource
        ] || 0;

    const required =
        PERMISSIONS[
        action.toUpperCase()
        ];

    const allowed =
        isAdmin ||
        hasPermission(
            value,
            required
        );

    if (!allowed) {
        return (
            <Navigate
                to={
                    isAdmin
                        ? "/dashboard"
                        : "/my-dashboard"
                }
                replace
            />
        );
    }

    return children;


}
