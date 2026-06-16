const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const permission = require('../middleware/permissionMiddleware');

const { createRole, getRoles, getRole, updateRole, deleteRole } = require('../controllers/roleController');

router.post(
    '/',
    authMiddleware,
    permission('roles', 'create'),
    createRole
);

router.get(
    '/',
    authMiddleware,
    permission('roles', 'view'),
    getRoles
);

router.get(
    '/:id',
    authMiddleware,
    permission('roles', 'view'),
    getRole
);


router.put(
    '/:id',
    authMiddleware,
    permission('roles', 'update'),
    updateRole
);

router.delete(
    '/:id',
    authMiddleware,
    permission('roles', 'delete'),
    deleteRole
);

module.exports = router;