const User = require("../models/user");
const Role = require("../models/Role");
const Activity = require("../models/ActivitySchema");

exports.getStats = async (req, res) => {
    try {
        const tenantId =
            req.user.tenantId._id;

        const totalUsers =
            await User.countDocuments({
                tenantId,
            });

        const activeUsers =
            await User.countDocuments({
                tenantId,
                status: "active",
            });

        const pendingUsers =
            await User.countDocuments({
                tenantId,
                status: "pending",
            });

        const totalRoles =
            await Role.countDocuments({
                tenantId,
            });

        const recentActivities =
            await Activity.find({
                tenantId,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(10);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalRoles,
                activeUsers,
                pendingUsers,
                recentActivities,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

exports.getDashboardActivity =
    async (req, res) => {
        try {
            const tenantId =
                req.user.tenantId._id;

            const recentUsers =
                await User.find({
                    tenantId,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .limit(5)
                    .populate(
                        "roleId"
                    );

            const recentRoles =
                await Role.find({
                    tenantId,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .limit(5);

            const pendingInvites =
                await User.countDocuments(
                    {
                        tenantId,
                        status:
                            "pending",
                    }
                );

            const recentActivities =
                await Activity.find({
                    tenantId,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .limit(10);

            res.json({
                success: true,
                data: {
                    recentUsers,
                    recentRoles,
                    pendingInvites,
                    recentActivities,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };



