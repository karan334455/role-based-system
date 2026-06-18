const Tenant =
    require("../models/Tenant");

const normalizePath = (
    file
) => {
    return `/${file.path.replace(
        /\\/g,
        "/"
    )}`;
};

exports.getSettings =
    async (req, res) => {
        try {
            const tenant =
                await Tenant.findById(
                    req.user
                        .tenantId
                        ._id
                );


            res.json({
                success: true,
                data: tenant,
            });
        } catch (
        error
        ) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


exports.updateSettings =
    async (req, res) => {
        try {
            const tenantId =
                req.user
                    .tenantId
                    ._id;


            const tenant =
                await Tenant.findById(
                    tenantId
                );

            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Tenant not found",
                });
            }

            // if (!tenant.settings) {
            //     tenant.settings = {};
            // }
            // if (!tenant.branding) {
            //     tenant.branding = {};
            // }
            // if (!tenant.documents) {
            //     tenant.documents = {};
            // }

            tenant.companyName =
                req.body.companyName ||
                tenant.companyName;

            tenant.companyEmail =
                req.body.companyEmail ||
                tenant.companyEmail;

            tenant.companyPhone =
                req.body.companyPhone ||
                tenant.companyPhone;

            tenant.website =
                req.body.website ||
                tenant.website;

            tenant.address =
                req.body.address ||
                tenant.address;

            tenant.gstNumber =
                req.body.gstNumber ||
                tenant.gstNumber;

            if (
                req.body.timezone
            ) {
                tenant.settings.timezone =
                    req.body.timezone;
            }

            if (
                req.files
                    ?.companyLogo?.[0]
            ) {
                tenant.branding.companyLogo =
                    normalizePath(
                        req.files
                            .companyLogo[0]
                    );
            }

            if (
                req.files
                    ?.favicon?.[0]
            ) {
                tenant.branding.favicon =
                    normalizePath(
                        req.files
                            .favicon[0]
                    );
            }

            if (
                req.files
                    ?.gstCertificate?.[0]
            ) {
                tenant.documents.gstCertificate =
                    normalizePath(
                        req.files
                            .gstCertificate[0]
                    );
            }

            if (
                req.files
                    ?.panCard?.[0]
            ) {
                tenant.documents.panCard =
                    normalizePath(
                        req.files
                            .panCard[0]
                    );
            }

            if (
                req.files
                    ?.incorporationCertificate?.[0]
            ) {
                tenant.documents.incorporationCertificate =
                    normalizePath(
                        req.files
                            .incorporationCertificate[0]
                    );
            }

            await tenant.save();

            res.json({
                success: true,
                message:
                    "Settings updated successfully",
                data: tenant,
            });
        } catch (
        error
        ) {
            console.log(
                error
            );

            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

