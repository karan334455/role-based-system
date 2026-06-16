export default function PermissionMatrix({
    permissions,
    setPermissions,
}) {
    const modules = [
        "dashboard",
        "users",
        "roles",
        "profile",

    ];

    const actions = [
        "view",
        "create",
        "update",
        "delete",
    ];

    const handleToggle = (
        module,
        action
    ) => {
        setPermissions((prev) => {
            const current =
                prev[module]?.[action];

            const updated = {
                ...prev,
                [module]: {
                    ...prev[module],
                    [action]: !current,
                },
            };

            // Delete => enable all permissions
            if (
                action === "delete" &&
                !current
            ) {
                updated[module] = {
                    view: true,
                    create: true,
                    update: true,
                    delete: true,
                };
            }

            // Create/Update require View
            if (
                (action === "create" ||
                    action === "update") &&
                !current
            ) {
                updated[module].view = true;
            }

            // View unchecked => remove all permissions
            if (
                action === "view" &&
                current
            ) {
                updated[module] = {
                    view: false,
                    create: false,
                    update: false,
                    delete: false,
                };
            }

            return updated;
        });
    };

    return (
        <div className="space-y-5">
            <h2 className="text-xl font-semibold">
                Permissions
            </h2>

            {modules.map((module) => (
                <div
                    key={module}
                    className="bg-gray-50 border rounded-xl p-5"
                >
                    <h3 className="font-semibold text-lg capitalize mb-4">
                        {module}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {actions.map(
                            (action) => (
                                <label
                                    key={action}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            permissions?.[
                                            module
                                            ]?.[
                                            action
                                            ] ||
                                            false
                                        }
                                        onChange={() =>
                                            handleToggle(
                                                module,
                                                action
                                            )
                                        }
                                        className="h-4 w-4"
                                    />

                                    <span className="capitalize">
                                        {
                                            action
                                        }
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}