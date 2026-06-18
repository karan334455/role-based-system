import { useEffect, useState } from "react";
import api from "@/app/axios";
import toast from "react-hot-toast";

const IMAGE_BASE_URL =
    "http://localhost:6001";

export default function Settings() {
    const [loading, setLoading] =
        useState(false);

    const [settings, setSettings] =
        useState({
            companyName: "",
            companyEmail: "",
            companyPhone: "",
            website: "",
            address: "",
            gstNumber: "",
            timezone:
                "Asia/Kolkata",
            plan: "",

            companyLogo: null,
            favicon: null,

            gstCertificate: null,
            panCard: null,
            incorporationCertificate:
                null,

            companyLogoPreview:
                "",
            faviconPreview: "",
        });

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
                    setSettings(
                        (
                            prev
                        ) => ({
                            ...prev,

                            companyName:
                                data
                                    .data
                                    ?.companyName ||
                                "",

                            companyEmail:
                                data
                                    .data
                                    ?.companyEmail ||
                                "",

                            companyPhone:
                                data
                                    .data
                                    ?.companyPhone ||
                                "",

                            website:
                                data
                                    .data
                                    ?.website ||
                                "",

                            address:
                                data
                                    .data
                                    ?.address ||
                                "",

                            gstNumber:
                                data
                                    .data
                                    ?.gstNumber ||
                                "",

                            timezone:
                                data
                                    .data
                                    ?.settings
                                    ?.timezone ||
                                "Asia/Kolkata",

                            plan:
                                data
                                    .data
                                    ?.plan ||
                                "free",

                            companyLogoPreview:
                                data
                                    .data
                                    ?.branding
                                    ?.companyLogo ||
                                "",

                            faviconPreview:
                                data
                                    .data
                                    ?.branding
                                    ?.favicon ||
                                "",
                        })
                    );
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

                const formData =
                    new FormData();

                formData.append(
                    "companyName",
                    settings.companyName
                );

                formData.append(
                    "companyEmail",
                    settings.companyEmail
                );

                formData.append(
                    "companyPhone",
                    settings.companyPhone
                );

                formData.append(
                    "website",
                    settings.website
                );

                formData.append(
                    "address",
                    settings.address
                );

                formData.append(
                    "gstNumber",
                    settings.gstNumber
                );

                formData.append(
                    "timezone",
                    settings.timezone
                );

                if (
                    settings.companyLogo
                ) {
                    formData.append(
                        "companyLogo",
                        settings.companyLogo
                    );
                }

                if (
                    settings.favicon
                ) {
                    formData.append(
                        "favicon",
                        settings.favicon
                    );
                }

                if (
                    settings.gstCertificate
                ) {
                    formData.append(
                        "gstCertificate",
                        settings.gstCertificate
                    );
                }

                if (
                    settings.panCard
                ) {
                    formData.append(
                        "panCard",
                        settings.panCard
                    );
                }

                if (
                    settings.incorporationCertificate
                ) {
                    formData.append(
                        "incorporationCertificate",
                        settings.incorporationCertificate
                    );
                }

                await api.put(
                    "/settings",
                    formData,
                    {
                        headers:
                        {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                toast.success(
                    "Settings updated successfully"
                );

                fetchSettings();
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
        <div className="max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">
                Settings
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
                className="bg-white rounded-xl shadow p-6 space-y-6"
            >
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block mb-2 font-medium">
                            Company
                            Name
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
                            Company
                            Email
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
                            Company
                            Phone
                        </label>

                        <input
                            type="text"
                            name="companyPhone"
                            value={
                                settings.companyPhone
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Website
                        </label>

                        <input
                            type="text"
                            name="website"
                            value={
                                settings.website
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Address
                    </label>

                    <textarea
                        rows="3"
                        name="address"
                        value={
                            settings.address
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        GST Number
                    </label>

                    <input
                        type="text"
                        name="gstNumber"
                        value={
                            settings.gstNumber
                        }
                        onChange={
                            handleChange
                        }
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="block mb-2 font-medium">
                            Company Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(
                                e
                            ) =>
                                setSettings(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,
                                        companyLogo:
                                            e
                                                .target
                                                .files[0],
                                    })
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Favicon
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(
                                e
                            ) =>
                                setSettings(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,
                                        favicon:
                                            e
                                                .target
                                                .files[0],
                                    })
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    <div>
                        <label className="block mb-2 font-medium">
                            GST Certificate
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(
                                e
                            ) =>
                                setSettings(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,
                                        gstCertificate:
                                            e
                                                .target
                                                .files[0],
                                    })
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            PAN Card
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(
                                e
                            ) =>
                                setSettings(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,
                                        panCard:
                                            e
                                                .target
                                                .files[0],
                                    })
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Incorporation
                            Certificate
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(
                                e
                            ) =>
                                setSettings(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,
                                        incorporationCertificate:
                                            e
                                                .target
                                                .files[0],
                                    })
                                )
                            }
                        />
                    </div>
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
