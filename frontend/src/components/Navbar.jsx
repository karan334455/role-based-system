import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext.jsx";

export default function Navbar() {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);


    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <h2 className="font-semibold text-lg">
                Welcome Back
            </h2>

            <div className="flex items-center gap-4">
                <span className="font-medium">
                    {user?.name}
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}