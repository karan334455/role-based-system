import Login from "../modules/Authentication/pages/Login";
import Register from "../modules/Authentication/pages/Register";
import VerifyOtp from "../modules/Authentication/pages/VerifyOtp";
import ForgotPassword from "../modules/Authentication/pages/ForgotPassword";
import ResetPassword from "../modules/Authentication/pages/ResetPassword";
import AcceptInvite from "../modules/Authentication/pages/AcceptInvite";

const AuthRoutes = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/verify-otp",
        element: <VerifyOtp />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
    {
        path: "/accept-invite/:token",
        element: <AcceptInvite />,
    },
];

export default AuthRoutes;