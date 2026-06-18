const Activity =
    require("../models/ActivitySchema");
const { Parser } =
    require("json2csv");


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



exports.exportActivityCsv =
    async (req, res) => {
        const logs =
            await ActivityLog.find()
                .sort({
                    createdAt: -1,
                });


        const fields = [
            "action",
            "description",
            "createdAt",
        ];

        const parser =
            new Parser({
                fields,
            });

        const csv =
            parser.parse(logs);

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment(
            "activity-logs.csv"
        );

        return res.send(csv);
    };

