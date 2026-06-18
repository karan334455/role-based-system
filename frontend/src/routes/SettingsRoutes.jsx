import Settings from "../modules/Settings/pages/Settings";
import CompanyProfile from "../modules/Settings/pages/CompanyProfile";
import ProtectedRoute from "../components/ProtectedRoute";

const SettingsRoutes = [
    {
        path: "/settings",
        element: (
            <ProtectedRoute resource="settings">
                <Settings />
            </ProtectedRoute>
        ),
    },
    {
        path: "/company-profile",
        element: (
            <ProtectedRoute resource="settings" action="view">
                <CompanyProfile />
            </ProtectedRoute>
        ),
    },
];

export default SettingsRoutes;