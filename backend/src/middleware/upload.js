const multer = require("multer");
const path = require("path");

const {
    userProfilePath,
} = require("../utils/uploadPathBuilder");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const tenantId =
                req.user?.tenantId?._id ||
                req.user?.tenantId ||
                "default_tenant";

            const userId =
                req.user?._id ||
                "default_user";

            const uploadDir =
                userProfilePath(
                    tenantId,
                    userId
                );

            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },

    filename: (req, file, cb) => {
        const ext = path
            .extname(file.originalname)
            .toLowerCase();

        cb(
            null,
            `avatar-${Date.now()}${ext}`
        );
    },
});

const fileFilter = (
    req,
    file,
    cb
) => {
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".jfif",
    ];

    const ext = path
        .extname(file.originalname)
        .toLowerCase();

    if (
        !allowedExtensions.includes(
            ext
        )
    ) {
        return cb(
            new Error(
                "Only JPG, JPEG, PNG, WEBP and JFIF images are allowed"
            ),
            false
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:
            5 * 1024 * 1024, // 5MB
    },
});

module.exports = upload;