const multer = require("multer");
const path = require("path");

const {
    companyLogoPath,
    companyFaviconPath,
    companyDocumentsPath,
} = require("../utils/uploadPathBuilder");

const storage =
    multer.diskStorage({
        destination: (
            req,
            file,
            cb
        ) => {
            try {
                const tenantId =
                    req.user
                        ?.tenantId
                        ?._id ||
                    req.user
                        ?.tenantId;

                let uploadDir;

                switch (
                file.fieldname
                ) {
                    case "companyLogo":
                        uploadDir =
                            companyLogoPath(
                                tenantId
                            );
                        break;

                    case "favicon":
                        uploadDir =
                            companyFaviconPath(
                                tenantId
                            );
                        break;

                    case "gstCertificate":
                        uploadDir =
                            companyDocumentsPath(
                                tenantId,
                                "gst"
                            );
                        break;

                    case "panCard":
                        uploadDir =
                            companyDocumentsPath(
                                tenantId,
                                "pan"
                            );
                        break;

                    case "incorporationCertificate":
                        uploadDir =
                            companyDocumentsPath(
                                tenantId,
                                "incorporation"
                            );
                        break;

                    default:
                        uploadDir =
                            companyDocumentsPath(
                                tenantId,
                                "general"
                            );
                }

                cb(
                    null,
                    uploadDir
                );
            } catch (
            error
            ) {
                cb(error);
            }
        },

        filename: (
            req,
            file,
            cb
        ) => {
            const ext =
                path.extname(
                    file.originalname
                );

            const safeName =
                file.originalname
                    .replace(
                        /\s+/g,
                        "_"
                    )
                    .replace(
                        /[^\w.-]/g,
                        ""
                    );

            cb(
                null,
                `${Date.now()}-${safeName}`
            );
        },
    });

const fileFilter = (
    req,
    file,
    cb
) => {
    const imageTypes =
        [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/x-icon",
            "image/vnd.microsoft.icon",
        ];

    const documentTypes =
        [
            "application/pdf",
        ];

    if (
        imageTypes.includes(
            file.mimetype
        ) ||
        documentTypes.includes(
            file.mimetype
        )
    ) {
        cb(
            null,
            true
        );
    } else {
        cb(
            new Error(
                "Only images and PDF files are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:
            10 *
            1024 *
            1024,
    },
});

module.exports = upload;