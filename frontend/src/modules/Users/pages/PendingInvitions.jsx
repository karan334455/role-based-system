import { useEffect, useState } from "react";
import {
    getPendingUsers,
    resendInvite,
    deleteUser,
} from "../../services/userService";
import toast from "react-hot-toast";

export default function PendingInvitations() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const { data } =
                await getPendingUsers();

            setUsers(data.data);
        } catch (error) {
            toast.error(
                "Failed to load pending users"
            );
        }
    };

    const handleResend = async (
        id
    ) => {
        try {
            await resendInvite(id);

            toast.success(
                "Invitation resent"
            );
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message
            );
        }
    };

    const handleDelete = async (
        id
    ) => {
        if (
            !window.confirm(
                "Delete invitation?"
            )
        )
            return;

        try {
            await deleteUser(id);

            toast.success(
                "Invitation cancelled"
            );

            fetchPendingUsers();
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message
            );
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Pending Invitations
            </h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
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
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(
                            (user) => (
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

                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleResend(
                                                    user._id
                                                )
                                            }
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            Resend
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    user._id
                                                )
                                            }
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}