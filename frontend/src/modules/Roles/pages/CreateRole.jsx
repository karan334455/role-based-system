import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createRole } from "../../services/roleService";
import PermissionMatrix from "../../../components/permissionMatrix";

export default function CreateRole() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [permissions, setPermissions] =
        useState({
            dashboard: 0,
            users: 0,
            roles: 0,
            profile: 0,
            settings: 0,
            activityLogs: 0,
        });


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error(
                "Role name is required"
            );
        }

        try {
            await createRole({
                name,
                permissions,
            });

            toast.success(
                "Role created successfully"
            );

            navigate("/roles");
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                "Failed to create role"
            );
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Create Role
                </h1>

                <p className="text-gray-500 mt-2">
                    Configure permissions for a
                    new role
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
                        placeholder="e.g. Sales Executive"
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
                        Create Role
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