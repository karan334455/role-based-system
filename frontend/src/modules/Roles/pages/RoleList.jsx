import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    Navigate,
} from "react-router-dom";
import Swal from "sweetalert2";
import {
    getRoles,
    deleteRole,
} from "../../services/roleService";
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

const can = (module, action) => {
    try {
        const user = JSON.parse(
            localStorage.getItem("user")
        );
        if (!user) return false;
        if (user?.roleId?.isAdmin === true) return true;

        const value = user?.roleId?.permissions?.[module] || 0;
        const required = PERMISSIONS[action.toUpperCase()];
        return hasPermission(value, required);
    } catch {
        return false;
    }
};

export default function RoleList() {
    const navigate = useNavigate();

    const [roles, setRoles] =
        useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const { data } =
                await getRoles();

            const filteredRoles =
                data.data.filter(
                    (role) =>
                        role.name !==
                        "Owner"
                );

            setRoles(filteredRoles);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load roles",
            });
        }
    };

    const handleDelete =
        async (id) => {
            const result =
                await Swal.fire({
                    title:
                        "Delete Role?",
                    text: "Are you sure you want to delete this role?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor:
                        "#dc2626",
                    confirmButtonText:
                        "Delete",
                });

            if (
                !result.isConfirmed
            )
                return;

            try {
                await deleteRole(id);

                Swal.fire({
                    icon: "success",
                    title:
                        "Deleted",
                    text: "Role deleted successfully",
                });

                fetchRoles();
            } catch (error) {
                if (
                    error.response
                        ?.status ===
                    401
                ) {
                    navigate(
                        "/login"
                    );
                    return;
                }

                Swal.fire({
                    icon: "error",
                    title:
                        "Error",
                    text:
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to delete role",
                });
            }
        };

    if (
        !can(
            "roles",
            "view"
        )
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    const showActions =
        can(
            "roles",
            "update"
        ) ||
        can(
            "roles",
            "delete"
        );

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    Roles
                </h1>

                {can(
                    "roles",
                    "create"
                ) && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/roles/create"
                                )
                            }
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                        >
                            Create Role
                        </button>
                    )}
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">
                                Role
                            </th>

                            {showActions && (
                                <th className="p-4 text-left">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {roles.map(
                            (
                                role
                            ) => (
                                <tr
                                    key={
                                        role._id
                                    }
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {
                                            role.name
                                        }
                                    </td>

                                    {showActions && (
                                        <td className="p-4 flex gap-2">

                                            {can(
                                                "roles",
                                                "update"
                                            ) && (
                                                    <Link
                                                        to={`/roles/edit/${role._id}`}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                            {can(
                                                "roles",
                                                "delete"
                                            ) &&
                                                role.name !==
                                                "Owner" && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                role._id
                                                            )
                                                        }
                                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                        </td>
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}