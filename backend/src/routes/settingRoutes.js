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
    getSettings,
    updateSettings,
} = require("../controllers/settingController");

router.get(
    "/",
    authMiddleware,
    permission(
        "settings",
        PERMISSIONS.VIEW
    ),
    getSettings
);

router.put(
    "/",
    authMiddleware,
    permission(
        "settings",
        PERMISSIONS.UPDATE
    ),
    updateSettings
);

module.exports =
    router;