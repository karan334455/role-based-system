const PERMISSIONS = {
    VIEW: 1,
    CREATE: 2,
    UPDATE: 4,
    DELETE: 8,
};

export default function PermissionMatrix({
    permissions,
    setPermissions,
}) {
    const modules = [
        "dashboard",
        "users",
        "roles",
        "profile",
        "activityLogs",
    ];

    const actions = [
        {
            key: "VIEW",
            label: "View",
            value: PERMISSIONS.VIEW,
        },
        {
            key: "CREATE",
            label: "Create",
            value: PERMISSIONS.CREATE,
        },
        {
            key: "UPDATE",
            label: "Update",
            value: PERMISSIONS.UPDATE,
        },
        {
            key: "DELETE",
            label: "Delete",
            value: PERMISSIONS.DELETE,
        },
    ];

    const handleToggle = (
        module,
        permission
    ) => {
        let current =
            permissions[module] || 0;

        const has =
            (current & permission) ===
            permission;

        if (!has) {
            switch (permission) {
                case PERMISSIONS.VIEW:
                    current |=
                        PERMISSIONS.VIEW;
                    break;

                case PERMISSIONS.CREATE:
                    current |=
                        PERMISSIONS.VIEW |
                        PERMISSIONS.CREATE;
                    break;

                case PERMISSIONS.UPDATE:
                    current |=
                        PERMISSIONS.VIEW |
                        PERMISSIONS.CREATE |
                        PERMISSIONS.UPDATE;
                    break;

                case PERMISSIONS.DELETE:
                    current |=
                        PERMISSIONS.VIEW |
                        PERMISSIONS.CREATE |
                        PERMISSIONS.UPDATE |
                        PERMISSIONS.DELETE;
                    break;

                default:
                    break;
            }
        } else {
            switch (permission) {
                case PERMISSIONS.VIEW:
                    current = 0;
                    break;

                case PERMISSIONS.CREATE:
                    current &=
                        ~(
                            PERMISSIONS.CREATE |
                            PERMISSIONS.UPDATE |
                            PERMISSIONS.DELETE
                        );
                    break;

                case PERMISSIONS.UPDATE:
                    current &=
                        ~(
                            PERMISSIONS.UPDATE |
                            PERMISSIONS.DELETE
                        );
                    break;

                case PERMISSIONS.DELETE:
                    current &=
                        ~PERMISSIONS.DELETE;
                    break;

                default:
                    break;
            }
        }

        setPermissions(
            (prev) => ({
                ...prev,
                [module]:
                    current,
            })
        );
    };

    return (
        <div className="space-y-5">
            <h2 className="text-xl font-semibold">
                Permissions
            </h2>

            {modules.map(
                (module) => {
                    const moduleActions =
                        module ===
                            "activityLogs"
                            ? actions.filter(
                                (
                                    a
                                ) =>
                                    a.key ===
                                    "VIEW"
                            )
                            : actions;

                    return (
                        <div
                            key={
                                module
                            }
                            className="bg-gray-50 border rounded-xl p-5"
                        >
                            <h3 className="font-semibold text-lg capitalize mb-4">
                                {module}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {moduleActions.map(
                                    (
                                        action
                                    ) => (
                                        <label
                                            key={
                                                action.key
                                            }
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    (
                                                        (permissions[module] || 0) &
                                                        action.value
                                                    ) === action.value
                                                }
                                                onChange={() =>
                                                    handleToggle(
                                                        module,
                                                        action.value
                                                    )
                                                }
                                            />

                                            <span>
                                                {
                                                    action.label
                                                }
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
}