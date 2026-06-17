const express =
    require("express");

const router =
    express.Router();

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const permission =
    require(
        "../middleware/permissionMiddleware"
    );

const PERMISSIONS =
    require(
        "../constants/permissions"
    );

const {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole,
} = require(
    "../controllers/roleController"
);

router.post(
    "/",
    authMiddleware,
    permission(
        "roles",
        PERMISSIONS.CREATE
    ),
    createRole
);

router.get(
    "/",
    authMiddleware,
    permission(
        "roles",
        PERMISSIONS.VIEW
    ),
    getRoles
);

router.get(
    "/:id",
    authMiddleware,
    permission(
        "roles",
        PERMISSIONS.VIEW
    ),
    getRole
);

router.put(
    "/:id",
    authMiddleware,
    permission(
        "roles",
        PERMISSIONS.UPDATE
    ),
    updateRole
);

router.delete(
    "/:id",
    authMiddleware,
    permission(
        "roles",
        PERMISSIONS.DELETE
    ),
    deleteRole
);

module.exports =
    router;
