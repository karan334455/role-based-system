import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../modules/Authentication/pages/Login";
import Register from "../modules/Authentication/pages/Register";
import VerifyOtp from "../modules/Authentication/pages/VerifyOtp";
import ForgotPassword from "../modules/Authentication/pages/ForgotPassword";
import ResetPassword from "../modules/Authentication/pages/ResetPassword";
import AcceptInvite from "../modules/Authentication/pages/AcceptInvite";
import Unauthorized from "../components/unAuthorized";

// Dashboard & Protected Pages
import Dashboard from "../modules/Dashboard/pages/Dashboard";
import UserDashboard from "../modules/User/pages/UserDashboard";
import UserList from "../modules/Users/pages/UserList";
import CreateUser from "../modules/Users/pages/CreateUser";
import EditUser from "../modules/Users/pages/EditUser";
import RoleList from "../modules/Roles/pages/RoleList";
import CreateRole from "../modules/Roles/pages/CreateRole";
import EditRole from "../modules/Roles/pages/EditRole";
import Profile from "../modules/profile/page/profile";
import ActivityLogs from "../modules/Activity/pages/ActivityLogs";
import MyActivity from "../modules/User/pages/MyActivity";
import Settings from "../modules/Settings/pages/Settings";

export const router = createBrowserRouter([
    // ── Public / Auth routes ──────────────────────────────────────────────────
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/verify-otp", element: <VerifyOtp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/accept-invite/:token", element: <AcceptInvite /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    // ── Protected application routes ──────────────────────────────────────────
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [

            // ── ADMIN dashboard — only if user has admin-level permissions ────
            // If a normal user visits /dashboard → ProtectedRoute redirects to /unauthorized
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute resource="adminOnly">
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },

            // ── USER dashboard — any logged-in user can access ────────────────
            {
                path: "my-dashboard",
                element: (
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                ),
            },

            // ── User management — admin only ──────────────────────────────────
            {
                path: "users",
                element: (
                    <ProtectedRoute resource="users" action="view">
                        <UserList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users/create",
                element: (
                    <ProtectedRoute resource="users" action="create">
                        <CreateUser />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users/edit/:id",
                element: (
                    <ProtectedRoute resource="users" action="update">
                        <EditUser />
                    </ProtectedRoute>
                ),
            },

            // ── Role management — admin only ──────────────────────────────────
            {
                path: "roles",
                element: (
                    <ProtectedRoute resource="roles" action="view">
                        <RoleList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "roles/create",
                element: (
                    <ProtectedRoute resource="roles" action="create">
                        <CreateRole />
                    </ProtectedRoute>
                ),
            },
            {
                path: "roles/edit/:id",
                element: (
                    <ProtectedRoute resource="roles" action="update">
                        <EditRole />
                    </ProtectedRoute>
                ),
            },

            // ── Profile — anyone ──────────────────────────────────────────────
            {
                path: "profile",
                element: (
                    <ProtectedRoute resource="profile" action="view">
                        <Profile />
                    </ProtectedRoute>
                ),
            },

            // ── Activity logs — admin only ────────────────────────────────────
            {
                path: "activities",
                element: (
                    <ProtectedRoute resource="users" action="view">
                        <ActivityLogs />
                    </ProtectedRoute>
                ),
            },

            // ── My Activity — any logged-in user ──────────────────────────────
            {
                path: "my-activity",
                element: (
                    <ProtectedRoute>
                        <MyActivity />
                    </ProtectedRoute>
                ),
            },

            // ── Settings — admin only ─────────────────────────────────────────
            {
                path: "settings",
                element: (
                    <ProtectedRoute resource="settings" action="view">
                        <Settings />
                    </ProtectedRoute>
                ),
            },
        ],
    },

    // ── Fallback ──────────────────────────────────────────────────────────────
    { path: "*", element: <Navigate to="/" replace /> },
]);