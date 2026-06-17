import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

export const getPermissions = () => {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        user?.roleId?.permissions || {}
    );
};

export const can = (
    module,
    action
) => {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );
    if (!user) return false;
    if (user?.roleId?.isAdmin === true) return true;

    const permissions = getPermissions();
    const value = permissions?.[module] || 0;
    const required = PERMISSIONS[action.toUpperCase()];
    if (!required) return false;

    return hasPermission(value, required);
};