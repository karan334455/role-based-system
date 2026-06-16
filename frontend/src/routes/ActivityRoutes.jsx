import ActivityLogs from "../modules/Activity/pages/ActivityLogs";
import ProtectedRoute from "../components/ProtectedRoute";

const ActivityRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ActivityLogs />
      </ProtectedRoute>
    ),
  },
];

export default ActivityRoutes;
