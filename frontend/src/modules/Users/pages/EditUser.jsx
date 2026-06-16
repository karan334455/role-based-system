
import { useEffect, useState } from "react";
import {
    useParams,
    useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
    getUsers,
    updateUser,
} from "../../services/userService";
import { getRoles } from "../../services/roleService";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            roleId: "",
        });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const usersRes =
                await getUsers();

            const user =
                usersRes.data.data.find(
                    (u) => u._id === id
                );

            if (user) {
                setFormData({
                    name: user.name,
                    email: user.email,
                    roleId:
                        user.roleId?._id,
                });
            }

            const rolesRes =
                await getRoles();

            setRoles(
                rolesRes.data.data
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateUser(
                id,
                formData
            );

            toast.success(
                "User updated successfully"
            );

            navigate("/users");
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message
            );
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">
                Edit User
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow space-y-5"
            >
                <div>
                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={
                            formData.name
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3 mt-2"
                    />
                </div>

                <div>
                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={
                            formData.email
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3 mt-2"
                    />
                </div>

                <div>
                    <label>
                        Role
                    </label>

                    <select
                        name="roleId"
                        value={
                            formData.roleId
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3 mt-2"
                    >
                        {roles.map(
                            (role) => (
                                <option
                                    key={
                                        role._id
                                    }
                                    value={
                                        role._id
                                    }
                                >
                                    {
                                        role.name
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                >
                    Update User
                </button>
            </form>
        </div>
    );
}

