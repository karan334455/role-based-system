const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const activityRoutes = require('./activityRoutes');
const settingRoutes = require("./settingRoutes");


router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/activities', activityRoutes);
router.use("/settings", settingRoutes);
module.exports = router;
