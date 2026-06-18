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
    acceptInvite,
    updateDocuments
} = require('../controllers/authController');
const upload =
    require("../middleware/upload");
const userDocumentUpload =
    require(
        "../middleware/userDocumentUpload"
    );


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
    upload.single(
        "profileImage"
    ),
    updateProfile
);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);
router.put(
    "/documents",
    authMiddleware,
    userDocumentUpload.fields([
        {
            name: "resume",
            maxCount: 1,
        },
        {
            name: "aadhaar",
            maxCount: 1,
        },
        {
            name: "panCard",
            maxCount: 1,
        },
        {
            name: "signature",
            maxCount: 1,
        },
    ]),
    updateDocuments
);


module.exports = router;