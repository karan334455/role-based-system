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

const tenantUpload =
    require("../middleware/tenantUpload");

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
    tenantUpload.fields([
        {
            name: "companyLogo",
            maxCount: 1,
        },
        {
            name: "favicon",
            maxCount: 1,
        },
        {
            name: "gstCertificate",
            maxCount: 1,
        },
        {
            name: "panCard",
            maxCount: 1,
        },
        {
            name:
                "incorporationCertificate",
            maxCount: 1,
        },
    ]),
    updateSettings
);

module.exports =
    router;
