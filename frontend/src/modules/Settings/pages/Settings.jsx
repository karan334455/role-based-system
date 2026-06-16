import { useEffect, useState } from "react";
import api from "@/app/axios";
import toast from "react-hot-toast";

export default function Settings() {
    const [settings, setSettings] =
        useState({
            companyName: "",
            companyEmail: "",
            timezone: "Asia/Kolkata",
            plan: "",
        });

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings =
        async () => {
            try {
                const { data } =
                    await api.get(
                        "/settings"
                    );

                if (
                    data.success
                ) {
                    setSettings({
                        companyName:
                            data.data
                                ?.companyName ||
                            "",

                        companyEmail:
                            data.data
                                ?.companyEmail ||
                            "",

                        timezone:
                            data.data
                                ?.timezone ||
                            "Asia/Kolkata",

                        plan:
                            data.data
                                ?.plan ||
                            "Free",
                    });
                }
            } catch (
            error
            ) {
                console.log(
                    error
                );
            }
        };

    const handleChange = (
        e
    ) => {
        setSettings({
            ...settings,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            try {
                setLoading(
                    true
                );

                await api.put(
                    "/settings",
                    {
                        companyName:
                            settings.companyName,

                        companyEmail:
                            settings.companyEmail,

                        timezone:
                            settings.timezone,
                    }
                );

                toast.success(
                    "Settings updated successfully"
                );
            } catch (
            error
            ) {
                toast.error(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                    "Failed to update settings"
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">
                Settings
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
                className="bg-white rounded-xl shadow p-6 space-y-5"
            >
                <div>
                    <label className="block mb-2 font-medium">
                        Company Name
                    </label>

                    <input
                        type="text"
                        name="companyName"
                        value={
                            settings.companyName
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Company Email
                    </label>

                    <input
                        type="email"
                        name="companyEmail"
                        value={
                            settings.companyEmail
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Timezone
                    </label>

                    <select
                        name="timezone"
                        value={
                            settings.timezone
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="Asia/Kolkata">
                            Asia/Kolkata
                        </option>

                        <option value="UTC">
                            UTC
                        </option>

                        <option value="America/New_York">
                            America/New_York
                        </option>

                        <option value="Europe/London">
                            Europe/London
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Current Plan
                    </label>

                    <input
                        disabled
                        value={
                            settings.plan
                        }
                        className="w-full border rounded-lg p-3 bg-gray-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        loading
                    }
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg"
                >
                    {loading
                        ? "Saving..."
                        : "Save Settings"}
                </button>
            </form>
        </div>
    );
}