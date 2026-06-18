const multer = require("multer");
const path = require("path");

const {
    userDocumentsPath,
    userSignaturePath,
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


                const userId =
                    req.user
                        ?._id;

                let uploadDir;

                switch (
                file.fieldname
                ) {
                    case "signature":
                        uploadDir =
                            userSignaturePath(
                                tenantId,
                                userId
                            );
                        break;

                    case "resume":
                    case "aadhaar":
                    case "panCard":
                        uploadDir =
                            userDocumentsPath(
                                tenantId,
                                userId
                            );
                        break;

                    default:
                        uploadDir =
                            userDocumentsPath(
                                tenantId,
                                userId
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

            switch (
            file.fieldname
            ) {
                case "resume":
                    cb(
                        null,
                        `resume${ext}`
                    );
                    break;

                case "aadhaar":
                    cb(
                        null,
                        `aadhaar${ext}`
                    );
                    break;

                case "panCard":
                    cb(
                        null,
                        `pan${ext}`
                    );
                    break;

                case "signature":
                    cb(
                        null,
                        `signature${ext}`
                    );
                    break;

                default:
                    cb(
                        null,
                        `${Date.now()}${ext}`
                    );
            }
        },
    });


const fileFilter = (
    req,
    file,
    cb
) => {
    const documentTypes =
        [
            "application/pdf",


            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

    if (
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
                "Invalid file type"
            ),
            false
        );
    }


};

module.exports =
    multer({
        storage,
        fileFilter,
        limits: {
            fileSize:
                10 *
                1024 *
                1024,
        },
    });
