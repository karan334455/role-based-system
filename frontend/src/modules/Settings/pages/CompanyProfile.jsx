import { useEffect, useState } from "react";
import api from "@/app/axios";

const IMAGE_BASE_URL =
    "http://localhost:6001";

export default function CompanyProfile() {
    const [company, setCompany] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany =
        async () => {
            try {
                const { data } =
                    await api.get(
                        "/settings"
                    );

                if (
                    data.success
                ) {
                    setCompany(
                        data.data
                    );
                }
            } catch (
            error
            ) {
                console.log(
                    error
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    const getFileUrl = (
        file
    ) => {
        if (!file)
            return null;

        return file.startsWith(
            "http"
        )
            ? file
            : `${IMAGE_BASE_URL}${file}`;
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Company Profile
                </h1>

                <p className="text-gray-500 mt-1">
                    View company
                    information and
                    uploaded
                    documents
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div>
                        {company
                            ?.branding
                            ?.companyLogo ? (
                            <img
                                src={getFileUrl(
                                    company
                                        .branding
                                        .companyLogo
                                )}
                                alt="Logo"
                                className="w-32 h-32 rounded-xl object-cover border"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-xl border flex items-center justify-center bg-slate-100 text-slate-500">
                                No Logo
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">
                            {
                                company.companyName
                            }
                        </h2>

                        <p className="text-gray-600">
                            {
                                company.companyEmail
                            }
                        </p>

                        <p className="text-gray-600">
                            {
                                company.companyPhone
                            }
                        </p>

                        <p className="text-gray-600">
                            {
                                company.website
                            }
                        </p>

                        <p className="text-gray-600 mt-2">
                            {
                                company.address
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Company Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-medium">
                            GST Number:
                        </span>
                        <p>
                            {
                                company.gstNumber
                            }
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">
                            Plan:
                        </span>
                        <p className="capitalize">
                            {
                                company.plan
                            }
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">
                            Status:
                        </span>
                        <p>
                            {company.isActive
                                ? "Active"
                                : "Inactive"}
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">
                            Timezone:
                        </span>
                        <p>
                            {
                                company
                                    ?.settings
                                    ?.timezone
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Documents
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <DocumentCard
                        title="GST Certificate"
                        file={
                            company
                                ?.documents
                                ?.gstCertificate
                        }
                    />

                    <DocumentCard
                        title="PAN Card"
                        file={
                            company
                                ?.documents
                                ?.panCard
                        }
                    />

                    <DocumentCard
                        title="Incorporation Certificate"
                        file={
                            company
                                ?.documents
                                ?.incorporationCertificate
                        }
                    />
                </div>
            </div>
        </div>
    );
}

function DocumentCard({
    title,
    file,
}) {
    const IMAGE_BASE_URL =
        "http://localhost:6001";

    return (
        <div className="border rounded-xl p-4">
            <h3 className="font-medium mb-3">
                {title}
            </h3>

            {file ? (
                <a
                    href={`${IMAGE_BASE_URL}${file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg"
                >
                    View Document
                </a>
            ) : (
                <p className="text-gray-400">
                    Not Uploaded
                </p>
            )}
        </div>
    );
}