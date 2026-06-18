import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getUsers,
    deleteUser,
    resendInvite,
} from "../../services/userService";
import toast from "react-hot-toast";
import PERMISSIONS from "@/constants/permissions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function UserList() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all");

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );
    useEffect(() => {
        fetchUsers();
    }, []);

    const isCurrentUserAdmin = currentUser?.roleId?.isAdmin === true;
    const canCreateUsers = isCurrentUserAdmin || !!((currentUser?.roleId?.permissions?.users || 0) & PERMISSIONS.CREATE);
    const canUpdateUsers = isCurrentUserAdmin || !!((currentUser?.roleId?.permissions?.users || 0) & PERMISSIONS.UPDATE);
    const canDeleteUsers = isCurrentUserAdmin || !!((currentUser?.roleId?.permissions?.users || 0) & PERMISSIONS.DELETE);
    // console.log("canCreateUsers", canCreateUsers);
    // console.log("canUpdateUsers", canUpdateUsers);
    // console.log("canDeleteUsers", canDeleteUsers);
    const fetchUsers = async () => {
        try {
            const { data } = await getUsers();
            setUsers(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete User?",
            text: "Are you sure you want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUser(id);

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "User deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

            fetchUsers();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error?.response?.data?.message ||
                    "Delete failed",
            });
        }
    };
    const handleResend = async (id) => {
        const result = await Swal.fire({
            title: "Resend Invitation?",
            text: "Send invitation email again?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Resend",
            confirmButtonColor: "#eab308",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await resendInvite(id);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Invitation resent successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error?.response?.data?.message ||
                    "Failed to resend invitation",
            });
        }
    };

    const filteredUsers =
        filter === "all"
            ? users
            : users.filter(
                (u) =>
                    u.status === filter
            );

    const downloadCSV = () => {
        const rows = filteredUsers.map(
            (user) => ({
                Name: user.name,
                Email: user.email,
                Role: user.roleId?.name || "User",
                Status: user.status,
            })
        );

        const headers = [
            "Name",
            "Email",
            "Role",
            "Status",
        ];

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                [
                    `"${row.Name}"`,
                    `"${row.Email}"`,
                    `"${row.Role}"`,
                    `"${row.Status}"`,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredUsers.map(
                (user) => ({
                    Name: user.name,
                    Email: user.email,
                    Role: user.roleId?.name || "User",
                    Status: user.status,
                })
            )
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Users"
        );

        XLSX.writeFile(
            workbook,
            "users.xlsx"
        );
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Users Report", 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [
                [
                    "Name",
                    "Email",
                    "Role",
                    "Status",
                ],
            ],
            body: filteredUsers.map(
                (user) => [
                    user.name,
                    user.email,
                    user.roleId?.name || "User",
                    user.status,
                ]
            ),
        });

        doc.save("users.pdf");
    };

    const printReport = () => {
        window.print();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Users
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage users and invitations
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={downloadCSV}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        CSV
                    </button>
                    <button
                        onClick={downloadExcel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        Excel
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        PDF
                    </button>
                    <button
                        onClick={printReport}
                        className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                    >
                        Print
                    </button>
                    {canCreateUsers && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/users/create"
                                )
                            }
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto text-center cursor-pointer"
                        >
                            Add User
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
                <button
                    onClick={() =>
                        setFilter("all")
                    }
                    className={`px-4 py-2 rounded-lg text-sm ${filter === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-white border"
                        }`}
                >
                    All Users
                </button>

                <button
                    onClick={() =>
                        setFilter(
                            "active"
                        )
                    }
                    className={`px-4 py-2 rounded-lg text-sm ${filter === "active"
                        ? "bg-green-600 text-white"
                        : "bg-white border"
                        }`}
                >
                    Active
                </button>

                <button
                    onClick={() =>
                        setFilter(
                            "pending"
                        )
                    }
                    className={`px-4 py-2 rounded-lg text-sm ${filter === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border"
                        }`}
                >
                    Pending
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            <th className="p-4 text-left">
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Role
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map(
                            (user) => {
                                const isAdmin =
                                    user
                                        ?.roleId
                                        ?.isAdmin ===
                                    true;

                                return (
                                    <tr
                                        key={
                                            user._id
                                        }
                                        className="border-b"
                                    >
                                        <td className="p-4">
                                            {
                                                user.name
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                user.email
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                user
                                                    .roleId
                                                    ?.name
                                            }
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${user.status ===
                                                    "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {
                                                    user.status
                                                }
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex gap-2 flex-wrap">

                                                {!isAdmin && canUpdateUsers && (
                                                    <Link
                                                        to={`/users/edit/${user._id}`}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {user.status ===
                                                    "pending" && (
                                                        <button
                                                            onClick={() =>
                                                                handleResend(
                                                                    user._id
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                                        >
                                                            Resend
                                                        </button>
                                                    )}

                                                {!isAdmin &&
                                                    canDeleteUsers &&
                                                    user._id !==
                                                    currentUser?._id && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user._id
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}

                                                {isAdmin && (
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded text-sm">
                                                        Protected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}