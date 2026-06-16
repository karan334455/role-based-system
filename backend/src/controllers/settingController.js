const Tenant = require("../models/Tenant");

exports.getSettings = async (
    req,
    res
) => {
    try {
        const tenant =
            await Tenant.findById(
                req.user.tenantId._id
            );

        res.json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateSettings =
    async (req, res) => {
        try {
            const tenant =
                await Tenant.findByIdAndUpdate(
                    req.user.tenantId
                        ._id,
                    req.body,
                    {
                        new: true,
                    }
                );

            res.json({
                success: true,
                data: tenant,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };