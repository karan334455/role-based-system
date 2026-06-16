const Activity =
    require("../models/ActivitySchema");

exports.getActivities =
    async (req, res) => {
        try {
            let query = {};

            // Admin sees all tenant activities
            if (
                req.user?.roleId
                    ?.isAdmin
            ) {
                query = {
                    tenantId:
                        req.user
                            .tenantId
                            ._id,
                };
            } else {
                // Normal user sees only own activities
                query = {
                    tenantId:
                        req.user
                            .tenantId
                            ._id,
                    userId:
                        req.user
                            ._id,
                };
            }

            const activities =
                await Activity.find(
                    query
                )
                    .populate(
                        "userId",
                        "name email"
                    )
                    .sort({
                        createdAt: -1,
                    })
                    .limit(100);

            res.json({
                success: true,
                data: activities,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.getMyActivities =
    async (req, res) => {
        try {
            const activities =
                await Activity.find({
                    tenantId:
                        req.user
                            .tenantId
                            ._id,
                    userId:
                        req.user
                            ._id,
                })
                    .populate(
                        "userId",
                        "name email"
                    )
                    .sort({
                        createdAt: -1,
                    })
                    .limit(100);

            res.json({
                success: true,
                data: activities,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };