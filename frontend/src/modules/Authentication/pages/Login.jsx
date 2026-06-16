import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";

const getHomeRoute = (user) => {
    const p = user?.roleId?.permissions || {};
    const isAdmin = user?.roleId?.isAdmin === true;
    return isAdmin ? "/dashboard" : "/my-dashboard";
};

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (token && user) {
            navigate(getHomeRoute(user), { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password)
            return toast.error("Email and Password are required");

        try {
            setLoading(true);
            const { data } = await loginUser(formData);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("[Login] user permissions:", data.user?.roleId?.permissions);

            toast.success("Login successful");
            navigate(getHomeRoute(data.user), { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .login-root { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; background: #0F0E1A; }
                .login-panel { display: none; width: 42%; position: relative; overflow: hidden; background: #1E1B4B; padding: 48px 44px; flex-direction: column; justify-content: space-between; }
                @media (min-width: 900px) { .login-panel { display: flex; } }
                .login-panel-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(139,92,246,0.3) 0%, transparent 60%); animation: meshDrift 8s ease-in-out infinite alternate; }
                @keyframes meshDrift { from { opacity: 0.8; transform: scale(1); } to { opacity: 1; transform: scale(1.04); } }
                .login-panel-content { position: relative; z-index: 1; }
                .login-logo { display: flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #fff; }
                .login-logo-dot { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #6366F1, #A78BFA); }
                .login-panel-headline { margin-top: 64px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 800; line-height: 1.15; color: #fff; letter-spacing: -0.8px; }
                .login-panel-headline span { background: linear-gradient(90deg, #A78BFA, #6366F1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .login-panel-sub { margin-top: 16px; font-size: 15px; color: #94A3B8; line-height: 1.6; max-width: 300px; }
                .login-testimonial { margin-top: 48px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); border-radius: 14px; padding: 20px 22px; }
                .login-testimonial-text { font-size: 14px; color: #CBD5E1; line-height: 1.65; font-style: italic; }
                .login-testimonial-author { margin-top: 14px; display: flex; align-items: center; gap: 10px; }
                .login-testimonial-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6366F1, #A78BFA); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; }
                .login-testimonial-name { font-size: 13px; font-weight: 600; color: #E2E8F0; }
                .login-testimonial-role { font-size: 12px; color: #64748B; }
                .login-panel-footer { position: relative; z-index: 1; font-size: 13px; color: #475569; }
                .login-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; background: #FAFAFA; }
                .login-card { width: 100%; max-width: 420px; }
                .login-mobile-logo { display: flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: #1E1B4B; margin-bottom: 32px; }
                @media (min-width: 900px) { .login-mobile-logo { display: none; } }
                .login-form-logo-dot { width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #6366F1, #A78BFA); }
                .login-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; }
                .login-subtitle { margin-top: 6px; font-size: 14px; color: #64748B; }
                .login-divider { margin: 24px 0; height: 1px; background: #E2E8F0; }
                .login-fields { display: flex; flex-direction: column; gap: 14px; }
                .login-field { display: flex; flex-direction: column; gap: 6px; }
                .login-field-header { display: flex; justify-content: space-between; align-items: center; }
                .login-label { font-size: 12.5px; font-weight: 600; color: #374151; }
                .login-forgot { font-size: 12px; font-weight: 500; color: #6366F1; text-decoration: none; }
                .login-forgot:hover { text-decoration: underline; }
                .login-input-wrap { position: relative; display: flex; align-items: center; }
                .login-input-icon { position: absolute; left: 13px; font-size: 15px; pointer-events: none; opacity: 0.65; }
                .login-input { width: 100%; padding: 11px 14px 11px 40px; font-size: 14px; font-family: 'Inter', sans-serif; color: #0F172A; background: #F1F5FE; border: 1.5px solid #E0E7FF; border-radius: 10px; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; }
                .login-input::placeholder { color: #94A3B8; }
                .login-input:focus { border-color: #6366F1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .login-btn { margin-top: 24px; width: 100%; padding: 13px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #4F46E5, #6366F1); border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
                .login-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
                .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .login-btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .login-register { margin-top: 20px; text-align: center; font-size: 13.5px; color: #64748B; }
                .login-register a { color: #4F46E5; font-weight: 600; text-decoration: none; }
                .login-register a:hover { text-decoration: underline; }
                .login-terms { margin-top: 14px; text-align: center; font-size: 11.5px; color: #94A3B8; line-height: 1.6; }
                .login-terms a { color: #6366F1; text-decoration: none; }
            `}</style>

            <div className="login-root">
                <div className="login-panel">
                    <div className="login-panel-mesh" />
                    <div className="login-panel-content">
                        <div className="login-logo"><div className="login-logo-dot" />TeamFlow</div>
                        <h2 className="login-panel-headline">Good to have<br />you <span>back.</span></h2>
                        <p className="login-panel-sub">Your team has been busy. Pick up right where you left off.</p>
                        <div className="login-testimonial">
                            <p className="login-testimonial-text">"TeamFlow cut our weekly status meetings in half. Everything we need is just… there."</p>
                            <div className="login-testimonial-author">
                                <div className="login-testimonial-avatar">SR</div>
                                <div>
                                    <div className="login-testimonial-name">Sara Reyes</div>
                                    <div className="login-testimonial-role">Head of Ops · Meridian Labs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="login-panel-footer">© 2026 TeamFlow · All rights reserved</div>
                </div>

                <div className="login-form-side">
                    <div className="login-card">
                        <div className="login-mobile-logo"><div className="login-form-logo-dot" />TeamFlow</div>
                        <h1 className="login-title">Welcome back</h1>
                        <p className="login-subtitle">Sign in to your TeamFlow workspace.</p>
                        <div className="login-divider" />
                        <form onSubmit={handleSubmit}>
                            <div className="login-fields">
                                <div className="login-field">
                                    <label className="login-label" htmlFor="email">Work Email</label>
                                    <div className="login-input-wrap">
                                        <span className="login-input-icon">✉️</span>
                                        <input id="email" className="login-input" type="email" name="email"
                                            placeholder="jane@acme.com" value={formData.email}
                                            onChange={handleChange} autoComplete="email" />
                                    </div>
                                </div>
                                <div className="login-field">
                                    <div className="login-field-header">
                                        <label className="login-label" htmlFor="password">Password</label>
                                        <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
                                    </div>
                                    <div className="login-input-wrap">
                                        <span className="login-input-icon">🔑</span>
                                        <input id="password" className="login-input" type="password" name="password"
                                            placeholder="Your password" value={formData.password}
                                            onChange={handleChange} autoComplete="current-password" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading && <span className="login-btn-spinner" />}
                                {loading ? "Signing in…" : "Sign in →"}
                            </button>
                        </form>
                        <p className="login-register">Don't have a workspace? <Link to="/register">Create one free</Link></p>
                        <p className="login-terms">Protected by <a href="#">TeamFlow Security</a> · <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}