const User =
    require("../models/user");

const Role =
    require("../models/Role");

const Activity =
    require(
        "../models/ActivitySchema"
    );

const Tenant =
    require(
        "../models/Tenant"
    );

exports.getStats =
    async (req, res) => {
        try {
            const tenantId =
                req.user
                    .tenantId
                    ._id;


            const [
                totalUsers,
                activeUsers,
                pendingUsers,
                totalRoles,
                recentActivities,
                tenant,
            ] =
                await Promise.all(
                    [
                        User.countDocuments(
                            {
                                tenantId,
                            }
                        ),

                        User.countDocuments(
                            {
                                tenantId,
                                status:
                                    "active",
                            }
                        ),

                        User.countDocuments(
                            {
                                tenantId,
                                status:
                                    "pending",
                            }
                        ),

                        Role.countDocuments(
                            {
                                tenantId,
                            }
                        ),

                        Activity.find(
                            {
                                tenantId,
                            }
                        )
                            .sort({
                                createdAt:
                                    -1,
                            })
                            .limit(
                                10
                            ),

                        Tenant.findById(
                            tenantId
                        ),
                    ]
                );

            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalRoles,
                    activeUsers,
                    pendingUsers,

                    companyName:
                        tenant?.companyName ||
                        "",

                    companyEmail:
                        tenant?.companyEmail ||
                        "",

                    companyPhone:
                        tenant?.companyPhone ||
                        "",

                    website:
                        tenant?.website ||
                        "",

                    plan:
                        tenant?.plan ||
                        "free",

                    isActive:
                        tenant?.isActive ||
                        false,

                    companyLogo:
                        tenant
                            ?.branding
                            ?.companyLogo ||
                        "",

                    recentActivities,
                },
            });
        } catch (
        error
        ) {
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
                req.user
                    .tenantId
                    ._id;


            const [
                recentUsers,
                recentRoles,
                pendingInvites,
                recentActivities,
            ] =
                await Promise.all(
                    [
                        User.find({
                            tenantId,
                        })
                            .sort({
                                createdAt:
                                    -1,
                            })
                            .limit(
                                5
                            )
                            .populate(
                                "roleId"
                            ),

                        Role.find({
                            tenantId,
                        })
                            .sort({
                                createdAt:
                                    -1,
                            })
                            .limit(
                                5
                            ),

                        User.countDocuments(
                            {
                                tenantId,
                                status:
                                    "pending",
                            }
                        ),

                        Activity.find(
                            {
                                tenantId,
                            }
                        )
                            .sort({
                                createdAt:
                                    -1,
                            })
                            .limit(
                                10
                            ),
                    ]
                );

            res.json({
                success: true,
                data: {
                    recentUsers,
                    recentRoles,
                    pendingInvites,
                    recentActivities,
                },
            });
        } catch (
        error
        ) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

