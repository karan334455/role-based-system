const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const permission = require('../middleware/permissionMiddleware');

const {
    createUser,
    getUsers,
    updateUserRole,
    updateUser,
    deleteUser,
    getPendingUsers,
    resendInvite,
} = require('../controllers/userController');

router.post(
    '/',
    authMiddleware,
    permission('users', 'create'),
    createUser
);

router.get(
    '/',
    authMiddleware,
    permission('users', 'view'),
    getUsers
);

router.get(
    "/pending",
    authMiddleware,
    getPendingUsers
);

router.put(
    '/:id',
    authMiddleware,
    permission('users', 'update'),
    updateUser
);

router.put(
    '/:id/role',
    authMiddleware,
    permission('users', 'update'),
    updateUserRole
);

router.delete(
    '/:id',
    authMiddleware,
    permission('users', 'delete'),
    deleteUser
);
router.post(
    "/:id/resend-invite",
    authMiddleware,
    resendInvite
);
module.exports = router;