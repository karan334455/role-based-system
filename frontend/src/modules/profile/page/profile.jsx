import React, {
    useEffect,
    useState,
    useContext,
} from "react";
import {
    Navigate,
} from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext.jsx";
import api from "@/app/axios";
import toast from "react-hot-toast";

const can = (module, action) => {
    try {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        return !!user?.roleId?.permissions?.[
            module
        ]?.[action];
    } catch {
        return false;
    }
};

export default function Profile() {
    const {
        setUser: setUserContext,
    } = useContext(UserContext);

    const [user, setUser] =
        useState({
            name: "",
            email: "",
            roleId: null,
        });

    const [loading, setLoading] =
        useState(false);

    const [passwordData,
        setPasswordData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile =
        async () => {
            try {
                const { data } =
                    await api.get(
                        "/auth/profile"
                    );

                if (
                    data.success
                ) {
                    setUser(
                        data.data
                    );

                    setUserContext(
                        data.data
                    );
                }
            } catch (error) {
                toast.error(
                    "Failed to load profile"
                );
            }
        };

    const handleChange = (
        e
    ) => {
        setUser({
            ...user,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            if (
                !can(
                    "profile",
                    "update"
                )
            ) {
                return toast.error(
                    "You do not have permission to update profile"
                );
            }

            try {
                setLoading(
                    true
                );

                await api.put(
                    "/auth/profile",
                    {
                        name:
                            user.name,
                    }
                );

                setUserContext({
                    ...user,
                    name:
                        user.name,
                });

                toast.success(
                    "Profile updated"
                );
            } catch (
            error
            ) {
                toast.error(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                    "Failed to update profile"
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    const handlePasswordChange =
        (e) => {
            setPasswordData({
                ...passwordData,
                [e.target.name]:
                    e.target
                        .value,
            });
        };

    const changePassword =
        async () => {
            if (
                !can(
                    "profile",
                    "update"
                )
            ) {
                return toast.error(
                    "You do not have permission to change password"
                );
            }

            if (
                passwordData.newPassword !==
                passwordData.confirmPassword
            ) {
                return toast.error(
                    "Passwords do not match"
                );
            }

            try {
                const {
                    data,
                } =
                    await api.put(
                        "/auth/change-password",
                        {
                            currentPassword:
                                passwordData.currentPassword,
                            newPassword:
                                passwordData.newPassword,
                        }
                    );

                toast.success(
                    data.message
                );

                setPasswordData(
                    {
                        currentPassword:
                            "",
                        newPassword:
                            "",
                        confirmPassword:
                            "",
                    }
                );
            } catch (
            error
            ) {
                toast.error(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                    "Failed to change password"
                );
            }
        };

    if (
        !can(
            "profile",
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

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage your account settings
                </p>
            </div>

            <form
                onSubmit={
                    handleSubmit
                }
                className="bg-white rounded-xl shadow p-6 space-y-5"
            >
                <h2 className="text-xl font-semibold">
                    Profile Information
                </h2>

                <div>
                    <label className="block mb-2 font-medium">
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={
                            user.name
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            !can(
                                "profile",
                                "update"
                            )
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={
                            user.email
                        }
                        disabled
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Role
                    </label>

                    <input
                        type="text"
                        value={
                            user
                                .roleId
                                ?.name ||
                            ""
                        }
                        disabled
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                </div>

                {can(
                    "profile",
                    "update"
                ) && (
                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                        >
                            {loading
                                ? "Updating..."
                                : "Update Profile"}
                        </button>
                    )}
            </form>

            {can(
                "profile",
                "update"
            ) && (
                    <div className="bg-white rounded-xl shadow p-6 space-y-5">
                        <h2 className="text-xl font-semibold">
                            Change Password
                        </h2>

                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={
                                passwordData.currentPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={
                                passwordData.newPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={
                                passwordData.confirmPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            className="w-full border rounded-lg p-3"
                        />

                        <button
                            onClick={
                                changePassword
                            }
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                        >
                            Change Password
                        </button>
                    </div>
                )}
        </div>
    );
}