import { useEffect, useState } from "react";
import api from "@/app/axios";
import { FiClock } from "react-icons/fi";

export default function MyActivity() {
    const [activities, setActivities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities =
        async () => {
            try {
                const { data } =
                    await api.get(
                        "/activities/me"
                    );

                setActivities(
                    data.data || []
                );
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    My Activity
                </h1>

                <p className="text-gray-500 mt-1">
                    Track your recent actions
                </p>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        Loading...
                    </div>
                ) : activities.length ===
                    0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No activity found
                    </div>
                ) : (
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b bg-slate-50">
                                <th className="p-4 text-left">
                                    Action
                                </th>

                                <th className="p-4 text-left">
                                    Description
                                </th>

                                <th className="p-4 text-left">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {activities.map(
                                (
                                    activity
                                ) => (
                                    <tr
                                        key={
                                            activity._id
                                        }
                                        className="border-b"
                                    >
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-2 font-medium">
                                                <FiClock />
                                                {
                                                    activity.action
                                                }
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            {
                                                activity.description
                                            }
                                        </td>

                                        <td className="p-4 text-gray-500">
                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}