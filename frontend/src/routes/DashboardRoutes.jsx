import EditUser from "../modules/Users/pages/EditUser";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../modules/Dashboard/pages/Dashboard";
import UserList from "../modules/Users/pages/UserList";
import CreateUser from "../modules/Users/pages/CreateUser";
import RoleList from "../modules/Roles/pages/RoleList";
import CreateRole from "../modules/Roles/pages/CreateRole";
import EditRole from "../modules/Roles/pages/EditRole";
import Profile from "../modules/profile/page/profile";
import ActivityLogs from "../modules/Activity/pages/ActivityLogs";
import Settings from "../modules/Settings/pages/Settings";



const DashboardRoutes = [
  {
    path: "/",
    element: <DashboardLayout />, // Wraps sidebar and navbar
    children: [
      {
        path: "dashboard",
        element: <Dashboard />, // Dashboard page component
      },
      {
        path: "users",
        element: <UserList />, // Users page component
      },
      {
        path: "users/create",
        element: <CreateUser />, // Create user page component
      },
      {
        path: "users/edit/:id",
        element: <EditUser />, // Edit user page component
      },
      {
        path: "roles",
        element: <RoleList />, // Roles page component
      },
      {
        path: "roles/create",
        element: <CreateRole />, // Create role page component
      },
      {
        path: "roles/edit/:id",
        element: <EditRole />, // Edit role page component
      },
      {
        path: "profile",
        element: <Profile />, // Profile page component
      },
      {
        path: "activities", 
        element: <ActivityLogs />, // Settings page component
      },
      {
        path: "settings",
        element: <Settings />, // Settings page component
      }
    ],
  },
];

export default DashboardRoutes;