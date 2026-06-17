const mongoose = require("mongoose");

const roleSchema =
    new mongoose.Schema(
        {
            tenantId: {
                type: mongoose
                    .Schema.Types
                    .ObjectId,
                ref: "Tenant",
                required: true,
            },


            name: {
                type: String,
                required: true,
                trim: true,
            },

            isAdmin: {
                type: Boolean,
                default: false,
            },

            permissions: {
                dashboard: {
                    type: Number,
                    default: 0,
                },

                users: {
                    type: Number,
                    default: 0,
                },

                roles: {
                    type: Number,
                    default: 0,
                },

                profile: {
                    type: Number,
                    default: 0,
                },

                settings: {
                    type: Number,
                    default: 0,
                },

                activityLogs: {
                    type: Number,
                    default: 0,
                },
            },
        },
        {
            timestamps: true,
        }
    );


module.exports =
    mongoose.model(
        "Role",
        roleSchema
    );
