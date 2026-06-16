const Activity = require("../models/ActivitySchema");

const logActivity = async ({
    tenantId,
    userId,
    action,
    description,
}) => {
    try {
        await Activity.create({
            tenantId,
            userId,
            action,
            description,
        });
    } catch (error) {
        console.error(
            "Activity Log Error:",
            error.message
        );
    }
};

module.exports = logActivity;