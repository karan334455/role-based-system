export const getPermissions = () => {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        user?.roleId?.permissions || {}
    );
};

export const can = (
    module,
    action
) => {
    const permissions =
        getPermissions();

    return !!permissions?.[module]?.[
        action
    ];
};