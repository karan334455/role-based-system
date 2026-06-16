const mongoose =
    require("mongoose");

const activitySchema =
    new mongoose.Schema(
        {
            tenantId: {
                type: mongoose
                    .Schema.Types
                    .ObjectId,
                ref: "Tenant",
                required: true,
            },

            userId: {
                type: mongoose
                    .Schema.Types
                    .ObjectId,
                ref: "User",
            },

            action: {
                type: String,
                required: true,
            },

            description: {
                type: String,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "Activity",
        activitySchema
    );