import Settings from "../modules/Settings/pages/Settings";
import ProtectedRoute from "../components/ProtectedRoute";

const SettingsRoutes = [{
    path: "/settings",
    element: (
        <ProtectedRoute resource="settings">
            <Settings />
        </ProtectedRoute>
    ),
}];

export default SettingsRoutes;