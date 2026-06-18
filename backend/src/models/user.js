const mongoose = require("mongoose");

const userSchema =
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },


            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
            },

            password: {
                type: String,
            },

            isVerified: {
                type: Boolean,
                default: false,
            },

            otp: Number,

            otpExpiresAt: Date,

            roleId: {
                type:
                    mongoose
                        .Schema
                        .Types
                        .ObjectId,
                ref: "Role",
            },

            tenantId: {
                type:
                    mongoose
                        .Schema
                        .Types
                        .ObjectId,
                ref: "Tenant",
                required: true,
            },

            inviteToken:
                String,

            inviteTokenExpire:
                Date,

            status: {
                type: String,
                enum: [
                    "pending",
                    "active",
                    "inactive",
                ],
                default:
                    "pending",
            },

            profileImage: {
                type: String,
                default: "",
            },

            documents: {
                resume: {
                    type: String,
                    default: "",
                },

                aadhaar: {
                    type: String,
                    default: "",
                },

                panCard: {
                    type: String,
                    default: "",
                },
            },

            signature: {
                type: String,
                default: "",
            },

            phone: {
                type: String,
                default: "",
            },

            designation: {
                type: String,
                default: "",
            },

            department: {
                type: String,
                default: "",
            },

            employeeCode: {
                type: String,
                default: "",
            },

            joiningDate: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );


module.exports =
    mongoose.model(
        "User",
        userSchema
    );
