import { useState } from "react";
import api from "@/app/axios";
import toast from "react-hot-toast";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            return toast.error(
                "Passwords do not match"
            );
        }

        try {
            setLoading(true);

            const { data } = await api.put(
                "/auth/change-password",
                {
                    currentPassword:
                        formData.currentPassword,
                    newPassword:
                        formData.newPassword,
                }
            );

            toast.success(data.message);

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">
                Change Password
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-4"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Current Password
                    </label>

                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        New Password
                    </label>

                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <button
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                >
                    {loading
                        ? "Updating..."
                        : "Change Password"}
                </button>
            </form>
        </div>
    );
}