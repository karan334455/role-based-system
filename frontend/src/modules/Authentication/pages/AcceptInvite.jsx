import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/app/axios";
import toast from "react-hot-toast";

export default function AcceptInvite() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        if (
            password !==
            confirmPassword
        ) {
            return toast.error(
                "Passwords do not match"
            );
        }

        if (password.length < 6) {
            return toast.error(
                "Password must be at least 6 characters"
            );
        }

        try {
            setLoading(true);

            const { data } =
                await api.post(
                    "/auth/accept-invite",
                    {
                        token,
                        password,
                    }
                );

            toast.success(
                data.message
            );

            navigate("/");
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                "Failed to activate account"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Accept Invitation
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Set your password to activate your account
                </p>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-4"
                >
                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={
                                password
                            }
                            onChange={(
                                e
                            ) =>
                                setPassword(
                                    e
                                        .target
                                        .value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={
                                confirmPassword
                            }
                            onChange={(
                                e
                            ) =>
                                setConfirmPassword(
                                    e
                                        .target
                                        .value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="w-full bg-slate-900 text-white py-3 rounded-lg"
                    >
                        {loading
                            ? "Activating..."
                            : "Activate Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}