import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6001/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("[Axios] No JWT token found in localStorage; requests to protected endpoints may fail.");
    } else {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;