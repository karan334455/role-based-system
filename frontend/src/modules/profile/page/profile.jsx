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
import PERMISSIONS from "@/constants/permissions";
import hasPermission from "@/utils/hasPermission";

const can = (module, action) => {
    try {
        const user = JSON.parse(
            localStorage.getItem("user")
        );
        if (!user) return false;
        if (user?.roleId?.isAdmin === true) return true;

        const value = user?.roleId?.permissions?.[module] || 0;
        const required = PERMISSIONS[action.toUpperCase()];
        return hasPermission(value, required);
    } catch {
        return false;
    }
};

const IMAGE_BASE_URL = "http://localhost:6001";

export default function Profile() {
    const {
        setUser: setUserContext,
    } = useContext(UserContext);

    const [user, setUser] = useState({
        name: "",
        email: "",
        roleId: null,
        profileImage: "",
        documents: {
            resume: "",
            aadhaar: "",
            panCard: "",
        },
        signature: "",
    });

    const [documentFiles, setDocumentFiles] = useState({
        resume: null,
        aadhaar: null,
        panCard: null,
        signature: null,
    });

    const [uploadingDocs, setUploadingDocs] = useState(false);

    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const getProfileImageSrc = () => {
        if (previewUrl) return previewUrl;
        if (user.profileImage) {
            const rawUrl = user.profileImage.startsWith("http")
                ? user.profileImage
                : `${IMAGE_BASE_URL}${user.profileImage}`;
            return encodeURI(rawUrl.trim());
        }
        return "";
    };

    const getFileUrl = (file) => {
        if (!file) return "";
        const rawUrl = file.startsWith("http")
            ? file
            : `${IMAGE_BASE_URL}${file}`;
        return encodeURI(rawUrl.trim());
    };

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/auth/profile");
            if (data.success) {
                setUser(data.data);
                setUserContext(data.data);
            }
        } catch (error) {
            toast.error("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File size exceeds 5MB limit");
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!can("profile", "update")) {
            return toast.error("You do not have permission to update profile");
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", user.name);
            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            const { data } = await api.put("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUser(data.data);
            setUserContext(data.data);
            localStorage.setItem("user", JSON.stringify(data.data));

            // Clear temporary file selection
            setSelectedFile(null);
            setPreviewUrl("");

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDocFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            return toast.error("File size exceeds 10MB limit");
        }

        setDocumentFiles(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleDocumentSubmit = async (e) => {
        e.preventDefault();

        if (!can("profile", "update")) {
            return toast.error("You do not have permission to update documents");
        }

        if (
            !documentFiles.resume &&
            !documentFiles.aadhaar &&
            !documentFiles.panCard &&
            !documentFiles.signature
        ) {
            return toast.error("Please select at least one document to upload");
        }

        try {
            setUploadingDocs(true);

            const formData = new FormData();
            if (documentFiles.resume) {
                formData.append("resume", documentFiles.resume);
            }
            if (documentFiles.aadhaar) {
                formData.append("aadhaar", documentFiles.aadhaar);
            }
            if (documentFiles.panCard) {
                formData.append("panCard", documentFiles.panCard);
            }
            if (documentFiles.signature) {
                formData.append("signature", documentFiles.signature);
            }

            const { data } = await api.put("/auth/documents", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (data.success) {
                toast.success("Documents uploaded successfully");
                setDocumentFiles({
                    resume: null,
                    aadhaar: null,
                    panCard: null,
                    signature: null,
                });
                fetchProfile();
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to upload documents"
            );
        } finally {
            setUploadingDocs(false);
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

                <div className="flex items-center gap-6 pb-4 border-b">
                    <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 flex items-center justify-center bg-slate-100">
                        {getProfileImageSrc() ? (
                            <img
                                src={getProfileImageSrc()}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display =
                                        "none";
                                }}
                            />
                        ) : (
                            <span className="text-4xl font-bold text-slate-700">
                                {user.name ? user.name.charAt(0).toUpperCase() : ""}
                            </span>
                        )}
                        {can("profile", "update") && (
                            <label className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Profile Picture</h3>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP. Max 5MB.</p>
                        {selectedFile && (
                            <button
                                type="button"
                                onClick={clearSelectedFile}
                                className="text-xs text-red-500 font-semibold mt-2 hover:underline cursor-pointer"
                            >
                                Remove chosen image
                            </button>
                        )}
                    </div>
                </div>

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

            {can("profile", "update") && (
                <form
                    onSubmit={handleDocumentSubmit}
                    className="bg-white rounded-xl shadow p-6 space-y-6"
                >
                    <div>
                        <h2 className="text-xl font-semibold">Documents & Signature</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Upload your documents and signature (PDF, Images. Max 10MB per file).
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Resume */}
                        <div className="border rounded-xl p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-slate-800">Resume</h3>
                                <div className="mt-2 text-xs">
                                    {user?.documents?.resume ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 font-semibold">✓ Uploaded</span>
                                            <a
                                                href={getFileUrl(user.documents.resume)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-red-500">Not Uploaded</span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleDocFileChange(e, "resume")}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {documentFiles.resume && (
                                    <p className="text-xs text-indigo-600 mt-1 font-medium truncate">
                                        Selected: {documentFiles.resume.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Aadhaar Card */}
                        <div className="border rounded-xl p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-slate-800">Aadhaar Card</h3>
                                <div className="mt-2 text-xs">
                                    {user?.documents?.aadhaar ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 font-semibold">✓ Uploaded</span>
                                            <a
                                                href={getFileUrl(user.documents.aadhaar)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-red-500">Not Uploaded</span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => handleDocFileChange(e, "aadhaar")}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {documentFiles.aadhaar && (
                                    <p className="text-xs text-indigo-600 mt-1 font-medium truncate">
                                        Selected: {documentFiles.aadhaar.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* PAN Card */}
                        <div className="border rounded-xl p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-slate-800">PAN Card</h3>
                                <div className="mt-2 text-xs">
                                    {user?.documents?.panCard ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600 font-semibold">✓ Uploaded</span>
                                            <a
                                                href={getFileUrl(user.documents.panCard)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-red-500">Not Uploaded</span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => handleDocFileChange(e, "panCard")}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {documentFiles.panCard && (
                                    <p className="text-xs text-indigo-600 mt-1 font-medium truncate">
                                        Selected: {documentFiles.panCard.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="border rounded-xl p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-slate-800">Signature</h3>
                                <div className="mt-2 text-xs">
                                    {user?.signature ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600 font-semibold">✓ Uploaded</span>
                                                <a
                                                    href={getFileUrl(user.signature)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-indigo-600 hover:underline font-medium"
                                                >
                                                    View Image
                                                </a>
                                            </div>
                                            <div className="w-24 h-12 border rounded bg-slate-50 overflow-hidden flex items-center justify-center p-1">
                                                <img
                                                    src={getFileUrl(user.signature)}
                                                    alt="Signature"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-red-500">Not Uploaded</span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleDocFileChange(e, "signature")}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {documentFiles.signature && (
                                    <p className="text-xs text-indigo-600 mt-1 font-medium truncate">
                                        Selected: {documentFiles.signature.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploadingDocs}
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer text-sm font-semibold"
                    >
                        {uploadingDocs ? "Uploading..." : "Upload Documents"}
                    </button>
                </form>
            )}

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