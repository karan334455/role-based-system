const PERMISSIONS =
    require(
        "../constants/permissions"
    );

const hasPermission = (
    current,
    required
) => {
    return (
        current &
        required
    ) === required;
};

module.exports =
    hasPermission;