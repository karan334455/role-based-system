
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createUser } from "../../services/userService";
import { getRoles } from "../../services/roleService";

export default function CreateUser() {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        roleId: "",
    });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const { data } = await getRoles();

            console.log("Roles:", data.data);

            setRoles(data.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load roles");
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.roleId
        ) {
            return toast.error(
                "All fields are required"
            );
        }

        try {
            setLoading(true);

            await createUser(formData);

            toast.success(
                "User created successfully"
            );

            navigate("/users");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create user"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Create User
                </h1>

                <p className="text-gray-500 mt-2">
                    Add a new team member
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Role
                    </label>

                    <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-800"
                    >
                        <option value="">
                            Select Role
                        </option>

                        {roles.map((role) => (
    <option key={role._id} value={role._id}>
        {role.name}
    </option>
))}
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                    >
                        {loading
                            ? "Creating..."
                            : "Create User"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/users")
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

