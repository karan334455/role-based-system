const express =
    require("express");

const router =
    express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    getActivities,
    getMyActivities,
} = require("../controllers/activityController");

router.get(
    "/",
    authMiddleware,
    getActivities
);

router.get(
    "/me",
    authMiddleware,
    getMyActivities
);

module.exports = router;