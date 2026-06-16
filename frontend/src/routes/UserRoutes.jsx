import UserList from "../modules/Users/pages/UserList";
import CreateUser from "../modules/Users/pages/CreateUser";
import EditUser from "../modules/Users/pages/EditUser";

import ProtectedRoute from "../components/ProtectedRoute";

const UserRoutes = [
    {
        path: "/users",
        element: (
            <ProtectedRoute resource="users">
                <UserList />
            </ProtectedRoute>
        ),
    },

    {
        path: "/users/create",
        element: (
            <ProtectedRoute
                resource="users"
                action="create"
            >
                <CreateUser />
            </ProtectedRoute>
        ),
    },

    {
        path: "/users/edit/:id",
        element: (
            <ProtectedRoute
                resource="users"
                action="update"
            >
                <EditUser />
            </ProtectedRoute>
        ),
    },
];

export default UserRoutes;