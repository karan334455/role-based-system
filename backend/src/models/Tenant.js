const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },

        slug: {
            type: String,
            unique: true,
            required: true,
        },

        plan: {
            type: String,
            enum: ['free', 'basic', 'pro'],
            default: 'free',
        },

        isActive: {
            type: Boolean,
            default: true,
        },


        companyEmail: {
            type: String,
            default: "",
        },

        companyLogo: {
            type: String,
            default: "",
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    'Tenant',
    tenantSchema
);