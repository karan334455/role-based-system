import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp } from "../../services/authService";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const email = localStorage.getItem("verifyEmail");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Enter OTP");

        try {
            setLoading(true);
            const { data } = await verifyOtp({ email, otp });
            toast.success(data.message);
            localStorage.removeItem("verifyEmail");
            navigate("/");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // Mask email for display: j***@acme.com
    const maskedEmail = email
        ? email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 5)) + c)
        : "your email";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .otp-root { min-height: 100vh; display: flex; font-family: 'Inter', sans-serif; background: #0F0E1A; }

                /* ── Left panel ── */
                .otp-panel { display: none; width: 42%; position: relative; overflow: hidden; background: #1E1B4B; padding: 48px 44px; flex-direction: column; justify-content: space-between; }
                @media (min-width: 900px) { .otp-panel { display: flex; } }
                .otp-panel-mesh { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(139,92,246,0.3) 0%, transparent 60%); animation: meshDrift 8s ease-in-out infinite alternate; }
                @keyframes meshDrift { from { opacity: 0.8; transform: scale(1); } to { opacity: 1; transform: scale(1.04); } }
                .otp-panel-content { position: relative; z-index: 1; }
                .otp-logo { display: flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 20px; color: #fff; }
                .otp-logo-dot { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #6366F1, #A78BFA); }
                .otp-panel-headline { margin-top: 64px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; font-weight: 800; line-height: 1.15; color: #fff; letter-spacing: -0.8px; }
                .otp-panel-headline span { background: linear-gradient(90deg, #A78BFA, #6366F1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .otp-panel-sub { margin-top: 16px; font-size: 15px; color: #94A3B8; line-height: 1.6; max-width: 300px; }

                /* Steps */
                .otp-steps { margin-top: 48px; display: flex; flex-direction: column; gap: 16px; }
                .otp-step { display: flex; align-items: flex-start; gap: 14px; }
                .otp-step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #A78BFA; flex-shrink: 0; margin-top: 1px; }
                .otp-step-text { font-size: 13.5px; color: #94A3B8; line-height: 1.55; }
                .otp-step-text strong { color: #E2E8F0; font-weight: 600; }

                .otp-panel-footer { position: relative; z-index: 1; font-size: 13px; color: #475569; }

                /* ── Right form side ── */
                .otp-form-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; background: #FAFAFA; }
                .otp-card { width: 100%; max-width: 420px; }

                /* Mobile logo */
                .otp-mobile-logo { display: flex; align-items: center; gap: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: #1E1B4B; margin-bottom: 32px; }
                @media (min-width: 900px) { .otp-mobile-logo { display: none; } }
                .otp-form-logo-dot { width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #6366F1, #A78BFA); }

                /* Icon badge */
                .otp-icon-badge { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #EEF2FF, #E0E7FF); display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 20px; }

                .otp-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px; }
                .otp-subtitle { margin-top: 6px; font-size: 14px; color: #64748B; line-height: 1.55; }
                .otp-subtitle strong { color: #4F46E5; font-weight: 600; }
                .otp-divider { margin: 24px 0; height: 1px; background: #E2E8F0; }

                /* OTP input */
                .otp-field { display: flex; flex-direction: column; gap: 6px; }
                .otp-label { font-size: 12.5px; font-weight: 600; color: #374151; }
                .otp-input-wrap { position: relative; display: flex; align-items: center; }
                .otp-input-icon { position: absolute; left: 13px; font-size: 15px; pointer-events: none; opacity: 0.65; }
                .otp-input { width: 100%; padding: 11px 14px 11px 40px; font-size: 20px; font-family: 'Inter', sans-serif; color: #0F172A; background: #F1F5FE; border: 1.5px solid #E0E7FF; border-radius: 10px; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; letter-spacing: 10px; font-weight: 700; text-align: center; }
                .otp-input::placeholder { color: #94A3B8; font-size: 14px; letter-spacing: normal; font-weight: 400; }
                .otp-input:focus { border-color: #6366F1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }

                /* Hint */
                .otp-hint { margin-top: 8px; font-size: 12px; color: #94A3B8; display: flex; align-items: center; gap: 5px; }

                /* Button */
                .otp-btn { margin-top: 24px; width: 100%; padding: 13px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #4F46E5, #6366F1); border: none; border-radius: 10px; cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
                .otp-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
                .otp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .otp-btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Back link */
                .otp-back { margin-top: 20px; text-align: center; font-size: 13.5px; color: #64748B; }
                .otp-back a { color: #4F46E5; font-weight: 600; text-decoration: none; cursor: pointer; }
                .otp-back a:hover { text-decoration: underline; }
                .otp-terms { margin-top: 14px; text-align: center; font-size: 11.5px; color: #94A3B8; line-height: 1.6; }
                .otp-terms a { color: #6366F1; text-decoration: none; }
            `}</style>

            <div className="otp-root">
                {/* ── Left panel ── */}
                <div className="otp-panel">
                    <div className="otp-panel-mesh" />
                    <div className="otp-panel-content">
                        <div className="otp-logo"><div className="otp-logo-dot" />TeamFlow</div>
                        <h2 className="otp-panel-headline">One step<br />from <span>access.</span></h2>
                        <p className="otp-panel-sub">Check your inbox — your verification code is waiting.</p>

                        <div className="otp-steps">
                            <div className="otp-step">
                                <div className="otp-step-num">1</div>
                                <p className="otp-step-text"><strong>Check your email</strong> — we sent a 6-digit code to your address.</p>
                            </div>
                            <div className="otp-step">
                                <div className="otp-step-num">2</div>
                                <p className="otp-step-text"><strong>Enter the code</strong> on this page. It expires in 10 minutes.</p>
                            </div>
                            <div className="otp-step">
                                <div className="otp-step-num">3</div>
                                <p className="otp-step-text"><strong>You're in.</strong> Your workspace will be ready immediately.</p>
                            </div>
                        </div>
                    </div>
                    <div className="otp-panel-footer">© 2026 TeamFlow · All rights reserved</div>
                </div>

                {/* ── Right form side ── */}
                <div className="otp-form-side">
                    <div className="otp-card">
                        <div className="otp-mobile-logo"><div className="otp-form-logo-dot" />TeamFlow</div>

                        <div className="otp-icon-badge">📬</div>
                        <h1 className="otp-title">Check your email</h1>
                        <p className="otp-subtitle">
                            We sent a 6-digit code to <strong>{maskedEmail}</strong>. Enter it below to verify your account.
                        </p>

                        <div className="otp-divider" />

                        <form onSubmit={handleSubmit}>
                            <div className="otp-field">
                                <label className="otp-label" htmlFor="otp">Verification Code</label>
                                <div className="otp-input-wrap">
                                    <span className="otp-input-icon">🔢</span>
                                    <input
                                        id="otp"
                                        className="otp-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="------"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        autoComplete="one-time-code"
                                        autoFocus
                                    />
                                </div>
                                <p className="otp-hint">⏱ Code expires in 10 minutes</p>
                            </div>

                            <button type="submit" className="otp-btn" disabled={loading}>
                                {loading && <span className="otp-btn-spinner" />}
                                {loading ? "Verifying…" : "Verify & Continue →"}
                            </button>
                        </form>

                        <p className="otp-back">
                            Didn't receive a code?{" "}
                            <a onClick={() => navigate("/")}>Back to login</a>
                        </p>
                        <p className="otp-terms">Protected by <a href="#">TeamFlow Security</a> · <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}