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
    createUser,
    getUsers,
    updateUserRole,
    updateUser,
    deleteUser,
    getPendingUsers,
    resendInvite,
} = require(
    "../controllers/userController"
);

router.post(
    "/",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.CREATE
    ),
    createUser
);

router.get(
    "/",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.VIEW
    ),
    getUsers
);

router.get(
    "/pending",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.VIEW
    ),
    getPendingUsers
);

router.put(
    "/:id",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.UPDATE
    ),
    updateUser
);

router.put(
    "/:id/role",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.UPDATE
    ),
    updateUserRole
);

router.delete(
    "/:id",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.DELETE
    ),
    deleteUser
);

router.post(
    "/:id/resend-invite",
    authMiddleware,
    permission(
        "users",
        PERMISSIONS.UPDATE
    ),
    resendInvite
);

module.exports =
    router;
