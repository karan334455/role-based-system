const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getStats,
    getDashboardActivity,
} = require('../controllers/dashboardController');

router.get(
    '/stats',
    authMiddleware,
    getStats
);
router.get(
    "/activity",
    authMiddleware,
    getDashboardActivity
);


module.exports = router;