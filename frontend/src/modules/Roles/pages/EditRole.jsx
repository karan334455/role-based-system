import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
    getRole,
    updateRole,
} from "../../services/roleService";
import PermissionMatrix from "../../../components/permissionMatrix";

export default function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [name, setName] =
        useState("");

    const [permissions, setPermissions] =
        useState({
            dashboard: 0,
            users: 0,
            roles: 0,
            profile: 0,
            settings: 0,
            activityLogs: 0,
        });
    useEffect(() => {
        fetchRole();
    }, []);

    const fetchRole = async () => {
        try {
            const { data } =
                await getRole(id);

            const role =
                data.data;

            setName(role.name);

            setPermissions(
                role.permissions ||
                permissions
            );
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                "Failed to load role"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            if (!name.trim()) {
                return toast.error(
                    "Role name is required"
                );
            }

            try {
                await updateRole(id, {
                    name,
                    permissions,
                });
                const currentUser =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                if (
                    currentUser?.roleId
                        ?._id === id
                ) {
                    localStorage.removeItem(
                        "user"
                    );

                    window.location.reload();
                }
                toast.success(
                    "Role updated successfully"
                );

                navigate("/roles");
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Update failed"
                );
            }
        };

    if (loading) {
        return (
            <div className="text-center py-10">
                Loading...
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Edit Role
                </h1>

                <p className="text-gray-500 mt-2">
                    Update role permissions
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >
                <div>
                    <label className="block font-medium mb-2">
                        Role Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <PermissionMatrix
                    permissions={
                        permissions
                    }
                    setPermissions={
                        setPermissions
                    }
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/roles")
                        }
                        className="border px-6 py-3 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}