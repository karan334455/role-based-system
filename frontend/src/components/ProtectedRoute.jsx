import { Navigate } from "react-router-dom";
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

export default function ProtectedRoute({ children, resource, action = "view" }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Not logged in
    if (!token || !user) return <Navigate to="/login" replace />;

    // No resource = any logged-in user can access
    if (!resource) return children;

    const permissions = user?.roleId?.permissions || {};

    // isAdmin = has any admin-level permission
    const isAdmin = user?.roleId?.isAdmin === true;
    // Guard admin-only dashboard
    if (resource === "adminOnly") {
        return isAdmin ? children : <Navigate to="/my-dashboard" replace />;
    }

    // Guard specific resource/action
    const value = permissions?.[resource] || 0;
    const required = PERMISSIONS[action.toUpperCase()];
    const allowed = isAdmin || hasPermission(value, required);

    console.log(
        `[ProtectedRoute] user="${user?.name}" role="${user?.roleId?.name}" resource="${resource}.${action}" allowed=${allowed} isAdmin=${isAdmin}`,
        permissions
    );

    if (!allowed) {
        return <Navigate to={isAdmin ? "/dashboard" : "/my-dashboard"} replace />;
    }

    return children;
}