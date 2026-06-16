import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

// Replaces toast with inline feedback for standalone preview
const useToast = () => ({
    error: (msg) => alert("Error: " + msg),
    success: (msg) => alert("Success: " + msg),
});

export default function Register() {
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.companyName || !formData.name || !formData.email || !formData.password) {
            return toast.error('All fields are required');
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        try {
            setLoading(true);
            await registerUser({
                companyName: formData.companyName,
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            toast.success('Registration successful');
            localStorage.setItem('verifyEmail', formData.email);
            navigate('/verify-otp');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: "companyName", label: "Company Name", type: "text", placeholder: "Acme Inc.", icon: "🏢" },
        { name: "name", label: "Your Full Name", type: "text", placeholder: "Jane Smith", icon: "👤" },
        { name: "email", label: "Work Email", type: "email", placeholder: "jane@acme.com", icon: "✉️" },
        { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters", icon: "🔑" },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password", icon: "🔒" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .reg-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Inter', sans-serif;
                    background: #0F0E1A;
                }

                /* ── LEFT PANEL ── */
                .reg-panel {
                    display: none;
                    width: 42%;
                    position: relative;
                    overflow: hidden;
                    background: #1E1B4B;
                    padding: 48px 44px;
                    flex-direction: column;
                    justify-content: space-between;
                }
                @media (min-width: 900px) { .reg-panel { display: flex; } }

                .reg-panel-mesh {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.35) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 80% at 80% 90%, rgba(139,92,246,0.3) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 50% at 50% 50%, rgba(30,27,75,0.9) 0%, transparent 100%);
                    animation: meshDrift 8s ease-in-out infinite alternate;
                }
                @keyframes meshDrift {
                    from { opacity: 0.8; transform: scale(1); }
                    to   { opacity: 1;   transform: scale(1.04); }
                }

                .reg-panel-content { position: relative; z-index: 1; }

                .reg-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 800;
                    font-size: 20px;
                    color: #fff;
                    letter-spacing: -0.3px;
                }
                .reg-logo-dot {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #6366F1, #A78BFA);
                }

                .reg-panel-headline {
                    margin-top: 64px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 36px;
                    font-weight: 800;
                    line-height: 1.15;
                    color: #fff;
                    letter-spacing: -0.8px;
                }
                .reg-panel-headline span {
                    background: linear-gradient(90deg, #A78BFA, #6366F1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .reg-panel-sub {
                    margin-top: 16px;
                    font-size: 15px;
                    color: #94A3B8;
                    line-height: 1.6;
                    max-width: 300px;
                }

                .reg-feature-list {
                    margin-top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .reg-feature {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    color: #CBD5E1;
                }
                .reg-feature-icon {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    background: rgba(99,102,241,0.2);
                    border: 1px solid rgba(99,102,241,0.35);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 15px;
                    flex-shrink: 0;
                }

                .reg-panel-footer {
                    position: relative;
                    z-index: 1;
                    font-size: 13px;
                    color: #475569;
                }

                /* ── RIGHT: FORM SIDE ── */
                .reg-form-side {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    background: #FAFAFA;
                }

                .reg-card {
                    width: 100%;
                    max-width: 440px;
                }

                /* Mobile logo */
                .reg-mobile-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 800;
                    font-size: 18px;
                    color: #1E1B4B;
                    margin-bottom: 32px;
                }
                @media (min-width: 900px) { .reg-mobile-logo { display: none; } }

                .reg-form-logo-dot {
                    width: 24px; height: 24px;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #6366F1, #A78BFA);
                }

                .reg-title {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    color: #0F172A;
                    letter-spacing: -0.5px;
                }
                .reg-subtitle {
                    margin-top: 6px;
                    font-size: 14px;
                    color: #64748B;
                }

                .reg-divider {
                    margin: 24px 0;
                    height: 1px;
                    background: #E2E8F0;
                }

                .reg-fields { display: flex; flex-direction: column; gap: 14px; }

                .reg-field { display: flex; flex-direction: column; gap: 6px; }

                .reg-label {
                    font-size: 12.5px;
                    font-weight: 600;
                    color: #374151;
                    letter-spacing: 0.2px;
                }

                .reg-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .reg-input-icon {
                    position: absolute;
                    left: 13px;
                    font-size: 15px;
                    pointer-events: none;
                    opacity: 0.65;
                }
                .reg-input {
                    width: 100%;
                    padding: 11px 14px 11px 40px;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                    color: #0F172A;
                    background: #F1F5FE;
                    border: 1.5px solid #E0E7FF;
                    border-radius: 10px;
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
                }
                .reg-input::placeholder { color: #94A3B8; }
                .reg-input:focus {
                    border-color: #6366F1;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }

                .reg-btn {
                    margin-top: 24px;
                    width: 100%;
                    padding: 13px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: #fff;
                    background: linear-gradient(135deg, #4F46E5, #6366F1);
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.35);
                    letter-spacing: 0.1px;
                }
                .reg-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
                }
                .reg-btn:active:not(:disabled) { transform: translateY(0); }
                .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .reg-btn-spinner {
                    display: inline-block;
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    vertical-align: middle;
                    margin-right: 8px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .reg-login {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 13.5px;
                    color: #64748B;
                }
                .reg-login a {
                    color: #4F46E5;
                    font-weight: 600;
                    text-decoration: none;
                }
                .reg-login a:hover { text-decoration: underline; }

                .reg-terms {
                    margin-top: 14px;
                    text-align: center;
                    font-size: 11.5px;
                    color: #94A3B8;
                    line-height: 1.6;
                }
                .reg-terms a { color: #6366F1; text-decoration: none; }
            `}</style>

            <div className="reg-root">

                {/* ── Left decorative panel ── */}
                <div className="reg-panel">
                    <div className="reg-panel-mesh" />

                    <div className="reg-panel-content">
                        <div className="reg-logo">
                            <div className="reg-logo-dot" />
                            TeamFlow
                        </div>

                        <h2 className="reg-panel-headline">
                            Your team's<br />
                            <span>command center</span><br />
                            starts here.
                        </h2>
                        <p className="reg-panel-sub">
                            Set up your workspace in under two minutes and bring your whole company together.
                        </p>

                        <div className="reg-feature-list">
                            {[
                                ["🗂️", "Centralized project boards"],
                                ["💬", "Real-time team messaging"],
                                ["📊", "Progress tracking & reports"],
                                ["🔐", "Role-based access controls"],
                            ].map(([icon, label]) => (
                                <div className="reg-feature" key={label}>
                                    <div className="reg-feature-icon">{icon}</div>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reg-panel-footer">
                        © 2026 TeamFlow · All rights reserved
                    </div>
                </div>

                {/* ── Right form side ── */}
                <div className="reg-form-side">
                    <div className="reg-card">

                        <div className="reg-mobile-logo">
                            <div className="reg-form-logo-dot" />
                            TeamFlow
                        </div>

                        <h1 className="reg-title">Create your workspace</h1>
                        <p className="reg-subtitle">
                            One account for your whole company — free to start.
                        </p>

                        <div className="reg-divider" />

                        <form onSubmit={handleSubmit}>
                            <div className="reg-fields">
                                {fields.map(({ name, label, type, placeholder, icon }) => (
                                    <div className="reg-field" key={name}>
                                        <label className="reg-label" htmlFor={name}>{label}</label>
                                        <div className="reg-input-wrap">
                                            <span className="reg-input-icon">{icon}</span>
                                            <input
                                                id={name}
                                                className="reg-input"
                                                type={type}
                                                name={name}
                                                placeholder={placeholder}
                                                value={formData[name]}
                                                onChange={handleChange}
                                                onFocus={() => setFocused(name)}
                                                onBlur={() => setFocused(null)}
                                                autoComplete={type === "password" ? "new-password" : "on"}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="reg-btn" disabled={loading}>
                                {loading && <span className="reg-btn-spinner" />}
                                {loading ? "Setting up workspace…" : "Create workspace →"}
                            </button>
                        </form>

                        <p className="reg-login">
                            Already have a workspace?{" "}
                            <Link to="/">Sign in</Link>
                        </p>

                        <p className="reg-terms">
                            By creating an account you agree to our{" "}
                            <a href="#">Terms of Service</a> and{" "}
                            <a href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}