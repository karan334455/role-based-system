const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
            // Password will be set when user accepts invitation
            // Not required for pending users created via invite flow
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        otp: Number,

        otpExpiresAt: Date,

        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true
        },
        // Invitation token fields
        inviteToken: String,
        inviteTokenExpire: Date,
        status: {
            type: String,
            enum: ['pending', 'active', 'inactive'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);