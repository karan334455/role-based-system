const express =
    require("express");

const router =
    express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const permission =
    require("../middleware/permissionMiddleware");

const PERMISSIONS =
    require("../constants/permissions");

const {
    getStats,
    getDashboardActivity,
} = require(
    "../controllers/dashboardController"
);

router.get(
    "/stats",
    authMiddleware,
    permission(
        "dashboard",
        PERMISSIONS.VIEW
    ),
    getStats
);

router.get(
    "/activity",
    authMiddleware,
    permission(
        "dashboard",
        PERMISSIONS.VIEW
    ),
    getDashboardActivity
);

module.exports =
    router;