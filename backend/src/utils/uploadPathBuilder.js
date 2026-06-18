const path = require("path");
const fs = require("fs");

const ensureDir = (dir) => {
    fs.mkdirSync(dir, {
        recursive: true,
    });


    return dir;


};

const tenantRoot = (
    tenantId
) => {
    return path.join(
        "uploads",
        String(tenantId)
    );
};

/*                                                                         |
| -------------------------------------------------------------------------- |
| Company                                                                    |
| -------------------------------------------------------------------------- |
| */

exports.companyLogoPath = (
    tenantId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "company",
            "logo"
        )
    );
};

exports.companyFaviconPath = (
    tenantId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "company",
            "favicon"
        )
    );
};

exports.companyDocumentsPath = (
    tenantId,
    type = "general"
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "company",
            "documents",
            type
        )
    );
};

/*                                                                         |
| -------------------------------------------------------------------------- |
| Users                                                                      |
| -------------------------------------------------------------------------- |
| */

exports.userProfilePath = (
    tenantId,
    userId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "users",
            String(userId),
            "profile"
        )
    );
};

exports.userDocumentsPath = (
    tenantId,
    userId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "users",
            String(userId),
            "documents"
        )
    );
};

exports.userSignaturePath = (
    tenantId,
    userId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "users",
            String(userId),
            "signatures"
        )
    );
};

/*                                                                         |
| -------------------------------------------------------------------------- |
| Teams                                                                      |
| -------------------------------------------------------------------------- |
| */

exports.teamLogoPath = (
    tenantId,
    teamId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "teams",
            String(teamId),
            "logo"
        )
    );
};

exports.teamDocumentsPath = (
    tenantId,
    teamId
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "teams",
            String(teamId),
            "documents"
        )
    );
};

/*                                                                         |
| -------------------------------------------------------------------------- |
| Exports                                                                    |
| -------------------------------------------------------------------------- |
| */

exports.exportsPath = (
    tenantId,
    type = "general"
) => {
    return ensureDir(
        path.join(
            tenantRoot(
                tenantId
            ),
            "exports",
            type
        )
    );
};
