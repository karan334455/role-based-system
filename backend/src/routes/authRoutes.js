const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
    register,
    verifyOtp,
    resendOtp,
    login,
    forgotPassword,
    resetPassword,
    profile,
    updateProfile,
    changePassword,
    acceptInvite
} = require('../controllers/authController');

router.post('/register', register);

router.post('/verify-otp', verifyOtp);

router.post('/resend-otp', resendOtp);

router.post('/login', login);
router.get(
    '/profile',
    authMiddleware,
    profile
);
router.post(
    '/forgot-password',
    forgotPassword
);
router.post(
    "/accept-invite",
    acceptInvite
);
router.post(
    '/reset-password',
    resetPassword
);
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);
module.exports = router;