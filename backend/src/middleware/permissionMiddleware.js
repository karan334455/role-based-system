const PERMISSIONS = require("../constants/permissions");
const hasPermission = require("../utils/hasPermission");

module.exports = (resource, permission) => {
    return (req, res, next) => {
        const role = req.user?.roleId;
        const isAdmin = role?.isAdmin === true;

        const value = role?.permissions?.[resource] || 0;

        const allowed = isAdmin || hasPermission(value, permission);

        console.log("===================");
        console.log("USER:", req.user?.name);
        console.log("ROLE:", role?.name);
        console.log("RESOURCE:", resource);
        console.log("REQUIRED:", permission);
        console.log("CURRENT VALUE:", value);
        console.log("IS ADMIN:", isAdmin);
        console.log("ALLOWED:", allowed);
        console.log("===================");

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        next();
    };
};
