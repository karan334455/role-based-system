
import api from "@/app/axios";

export const getDashboardStats = () =>
    api.get("/dashboard/stats");
export const getDashboardActivity =
    () => api.get("/dashboard/activity");
export const getActivities =
    () =>
        api.get(
            "/activities"
        );