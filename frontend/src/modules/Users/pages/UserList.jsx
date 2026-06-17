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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Users
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage users and invitations
                    </p>
                </div>

                {canCreateUsers && (
                    <button
                        onClick={() =>
                            navigate(
                                "/users/create"
                            )
                        }
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                    >
                        Add User
                    </button>
                )}
            </div>

            <div className="flex gap-3 mb-5">
                <button
                    onClick={() =>
                        setFilter("all")
                    }
                    className={`px-4 py-2 rounded-lg ${filter === "all"
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
                    className={`px-4 py-2 rounded-lg ${filter === "active"
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
                    className={`px-4 py-2 rounded-lg ${filter === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white border"
                        }`}
                >
                    Pending
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
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