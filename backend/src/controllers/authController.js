
const User = require('../models/user');
const Tenant = require('../models/Tenant');
const Role = require('../models/Role');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { sendOtpMail } = require('../utils/sendMail');

const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

/*
=====================================
FORGOT PASSWORD
=====================================
*/
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const otp = generateOtp();

        user.otp = otp;
        user.otpExpiresAt =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendOtpMail(email, otp);

        res.json({
            success: true,
            message: 'Password reset OTP sent',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
RESET PASSWORD
=====================================
*/
exports.resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (
            user.otp?.toString() !==
            otp?.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        if (user.otpExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired',
            });
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
PROFILE
=====================================
*/
exports.profile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user._id
        )
            .populate('tenantId')
            .populate('roleId')
            .select(
                '-password -otp -otpExpiresAt'
            );

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

/*
=====================================
REGISTER COMPANY
=====================================
*/
exports.register = async (req, res) => {
    try {
        const {
            companyName,
            name,
            email,
            password,
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const slug = companyName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        const existingTenant =
            await Tenant.findOne({ slug });

        if (existingTenant) {
            return res.status(400).json({
                success: false,
                message:
                    'Company name is already registered',
            });
        }

        const tenant = await Tenant.create({
            companyName,
            slug,
        });

        const [ownerRole] = await Role.insertMany([
            {
                tenantId: tenant._id,
                name: 'Owner',
                isAdmin: true,
                permissions: {
                    dashboard: 15,
                    users: 15,
                    roles: 15,
                    profile: 15,
                    settings: 15,
                    activityLogs: 15,
                },
            },

            {
                tenantId: tenant._id,
                name: 'HR',
                permissions: {
                    dashboard: 1,
                    users: 7,
                    roles: 1,
                    profile: 7,
                    settings: 1,
                    activityLogs: 1,
                },
            },

            {
                tenantId: tenant._id,
                name: 'Manager',
                permissions: {
                    dashboard: 1,
                    users: 7,
                    roles: 0,
                    profile: 7,
                    settings: 0,
                    activityLogs: 1,
                },
            },

            {
                tenantId: tenant._id,
                name: 'Employee',
                permissions: {
                    dashboard: 1,
                    users: 0,
                    roles: 0,
                    profile: 7,
                    settings: 0,
                    activityLogs: 0,
                },
            },
        ]);

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const otp = generateOtp();

        const user = await User.create({
            tenantId: tenant._id,
            roleId: ownerRole._id,
            name,
            email,
            password: hashedPassword,
            otp,
            status: 'pending',
            otpExpiresAt:
                Date.now() + 10 * 60 * 1000,
        });

        await sendOtpMail(email, otp);

        res.status(201).json({
            success: true,
            message:
                'Company registered successfully',
            tenantId: tenant._id,
            roleId: ownerRole._id,
            userId: user._id,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
ACCEPT INVITATION
=====================================
*/
exports.acceptInvite = async (req, res) => {
    try {
        const { token, password } =
            req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Token and password are required",
            });
        }

        const user =
            await User.findOne({
                inviteToken: token,
                inviteTokenExpire: {
                    $gt: Date.now(),
                },
            });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Invitation link is invalid or expired",
            });
        }

        user.password =
            await bcrypt.hash(
                password,
                10
            );

        user.status = "active";
        user.isVerified = true;

        user.inviteToken =
            undefined;

        user.inviteTokenExpire =
            undefined;

        await user.save();

        res.json({
            success: true,
            message:
                "Account activated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
/*
=====================================
VERIFY OTP
=====================================
*/
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (
            user.otp?.toString() !==
            otp?.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        if (user.otpExpiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired',
            });
        }

        user.isVerified = true;
        user.status = 'active';
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        res.json({
            success: true,
            message:
                'Email verified successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
RESEND OTP
=====================================
*/
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const otp = generateOtp();

        user.otp = otp;
        user.otpExpiresAt =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendOtpMail(email, otp);

        res.json({
            success: true,
            message: 'OTP resent successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
LOGIN
=====================================
*/
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    'Email and password are required',
            });
        }

        const user = await User.findOne({
            email,
        })
            .populate('tenantId')
            .populate('roleId');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message:
                    'Please verify email first',
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                tenantId: user.tenantId?._id || user.tenantId,
                roleId: user.roleId?._id || user.roleId,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        const userData = user.toObject();

        delete userData.password;
        delete userData.otp;
        delete userData.otpExpiresAt;

        res.json({
            success: true,
            token,
            user: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: req.body.name,
            },
            {
                new: true,
            }
        ).populate("roleId");

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

exports.changePassword = async (
    req,
    res
) => {
    try {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        const user =
            await User.findById(
                req.user._id
            );

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect",
            });
        }

        user.password =
            await bcrypt.hash(
                newPassword,
                10
            );

        await user.save();

        res.json({
            success: true,
            message:
                "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};