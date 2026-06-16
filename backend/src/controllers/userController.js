const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { sendCustomMail } = require("../utils/sendMail");
const inviteTemplate = require("../templates/inviteTemplate");
const mongoose = require('mongoose');
const logActivity = require("../utils/logActivity");

// Base URL for the front‑end – fallback to Vite dev port if env var missing
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

exports.createUser = async (req, res) => {
    try {
        const { name, email, roleId } = req.body;

        // Validate roleId format
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid roleId format',
            });
        }

        if (
            !name ||
            !email ||
            !roleId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and role are required",
            });
        }

        const existingUser =
            await User.findOne({
                email,
            });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    "Email already exists",
            });
        }

        const inviteToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        const user =
            await User.create({
                name,
                email,
                roleId,

                tenantId:
                    req.user
                        ?.tenantId
                        ?._id,

                status: "pending",

                isVerified: false,

                inviteToken,

                inviteTokenExpire:
                    Date.now() +
                    24 *
                    60 *
                    60 *
                    1000,
            });

        const inviteLink =
            `${FRONTEND_URL}/accept-invite/${inviteToken}`;
        console.log(inviteLink);
        // Send invitation email
        await sendCustomMail(
            email,
            "You're invited to TeamFlow",
            inviteTemplate(name, inviteLink)
        );
        console.log(req.user);
        await logActivity({
            tenantId: req.user.tenantId._id,
            userId: req.user._id,
            action: "CREATE_USER",
            description: `Created user ${name}`,
        });

        await logActivity({
            tenantId: req.user.tenantId._id,
            userId: req.user._id,
            action: "INVITE_SENT",
            description: `Invitation sent to ${email}`,
        });
        res.status(201).json({
            success: true,
            message:
                "Invitation sent successfully",
            data: {
                userId: user._id,
                email: user.email,
                inviteLink,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateUserRole = async (req, res) => {
    try {
        const { roleId } = req.body;

        const user = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                tenantId: req.user.tenantId._id,
            },
            {
                roleId,
            },
            {
                new: true,
            }
        ).populate('roleId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId._id,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        await logActivity({
            tenantId: req.user.tenantId._id,
            userId: req.user._id,
            action: "DELETE_USER",
            description: `Deleted user ${user.name}`,
        });
        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                tenantId: req.user.tenantId._id,
            },
            {
                name: req.body.name,
                email: req.body.email,
                roleId: req.body.roleId,
            },
            {
                new: true,
            }
        ).populate('roleId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        await logActivity({
            tenantId: req.user.tenantId._id,
            userId: req.user._id,
            action: "UPDATE_USER",
            description: `Updated user ${user.name}`,
        });
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({
            tenantId: req.user.tenantId._id,
        }).populate('roleId');

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getPendingUsers =
    async (req, res) => {
        try {
            const users =
                await User.find({
                    tenantId:
                        req.user
                            .tenantId
                            ._id,
                    status:
                        "pending",
                }).populate(
                    "roleId"
                );

            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


exports.resendInvite = async (
    req,
    res
) => {
    try {
        const user =
            await User.findOne({
                _id: req.params.id,
                tenantId:
                    req.user.tenantId
                        ._id,
            }).populate(
                "roleId"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }

        if (
            user.status ===
            "active"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "User is already active",
            });
        }

        const inviteToken =
            crypto
                .randomBytes(32)
                .toString("hex");

        user.inviteToken =
            inviteToken;

        user.inviteTokenExpire =
            Date.now() +
            24 *
            60 *
            60 *
            1000;

        await user.save();

        const inviteLink =
            `${process.env.CLIENT_URL}/accept-invite/${inviteToken}`;

        await sendCustomMail(
            user.email,
            "You're invited to TeamFlow",
            inviteTemplate(
                user.name,
                inviteLink
            )
        );
        await logActivity({
            tenantId: req.user.tenantId._id,
            userId: req.user._id,
            action: "INVITE_RESENT",
            description: `Invitation resent to ${user.email}`,
        });
        res.json({
            success: true,
            message:
                "Invitation resent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};