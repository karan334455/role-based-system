const mongoose = require("mongoose");
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

        companyEmail: {
            type: String,
            default: "",
        },

        companyPhone: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        gstNumber: {
            type: String,
            default: "",
        },

        plan: {
            type: String,
            enum: [
                "free",
                "basic",
                "pro",
            ],
            default: "free",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        branding: {
            companyLogo: {
                type: String,
                default: "",
            },

            favicon: {
                type: String,
                default: "",
            },

            primaryColor: {
                type: String,
                default: "#0f172a",
            },
        },

        documents: {
            gstCertificate: {
                type: String,
                default: "",
            },

            panCard: {
                type: String,
                default: "",
            },

            incorporationCertificate: {
                type: String,
                default: "",
            },
        },

        settings: {
            timezone: {
                type: String,
                default: "Asia/Kolkata",
            },

            emailNotifications: {
                type: Boolean,
                default: true,
            },
        },


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Tenant", tenantSchema);

