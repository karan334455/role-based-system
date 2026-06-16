import { useEffect, useState } from "react";
import api from "@/app/axios";
import { FiClock, FiUser, FiInfo, FiLayers } from "react-icons/fi";

export default function UserDashboard() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const { data } = await api.get("/activities/me");
            setActivities(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            {/* Top Banner / Welcome message */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="mt-2 text-indigo-100 text-base max-w-xl">
                        Here is your overview for today at <span className="font-semibold">{user.tenantId?.companyName || "your workspace"}</span>.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none pointer-events-none">
                    <span className="text-9xl">👋</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <FiUser className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Your Role</p>
                        <h3 className="text-lg font-bold text-slate-800">{user.roleId?.name || "Member"}</h3>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <FiInfo className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Account Status</p>
                        <h3 className="text-lg font-bold text-slate-800 capitalize">{user.status || "Active"}</h3>
                    </div>
                </div>

                {/* Plan Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                        <FiLayers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Workspace Plan</p>
                        <h3 className="text-lg font-bold text-slate-800 capitalize">{user.tenantId?.plan || "Free"}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activities Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FiClock className="text-indigo-600" />
                        My Recent Activity
                    </h2>
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
                        {activities.length} total events
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading activities...</div>
                    ) : activities.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            No activities logged yet.
                        </div>
                    ) : (
                        activities.slice(0, 5).map((activity) => (
                            <div key={activity._id} className="p-4 hover:bg-slate-50/30 transition flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5">
                                    <FiClock className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">{activity.action}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                                </div>
                                <div className="text-xs text-slate-400 whitespace-nowrap">
                                    {new Date(activity.createdAt).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}