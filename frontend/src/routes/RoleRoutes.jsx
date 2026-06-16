import RoleList from "../modules/Roles/pages/RoleList";
import CreateRole from "../modules/Roles/pages/CreateRole";
import EditRole from "../modules/Roles/pages/EditRole";
import ProtectedRoute from "../components/ProtectedRoute";

const RoleRoutes = [
  {
    path: "/roles",
    element: (
      <ProtectedRoute resource="roles">
        <RoleList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/roles/create",
    element: (
      <ProtectedRoute resource="roles" action="create">
        <CreateRole />
      </ProtectedRoute>
    ),
  },
  {
    path: "/roles/edit/:id",
    element: (
      <ProtectedRoute resource="roles" action="update">
        <EditRole />
      </ProtectedRoute>
    ),
  },
];

export default RoleRoutes;