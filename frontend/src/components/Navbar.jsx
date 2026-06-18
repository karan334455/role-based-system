import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext.jsx";

export default function Navbar({ onToggleSidebar }) {
    const navigate = useNavigate();

    const { user } = useContext(UserContext);


    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger menu */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
                    aria-label="Toggle Sidebar"
                >
                    <span className="text-xl">☰</span>
                </button>
                <h2 className="font-semibold text-lg">
                    Welcome Back
                </h2>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                        {user?.profileImage ? (
                            <img
                                src={encodeURI(
                                    user.profileImage.startsWith("http")
                                        ? user.profileImage
                                        : `http://localhost:6001${user.profileImage}`
                                )}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-sm font-bold text-slate-600">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </span>
                        )}
                    </div>
                    <span className="font-medium text-sm md:text-base max-w-[100px] md:max-w-none truncate">
                        {user?.name}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-lg cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}