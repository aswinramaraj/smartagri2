// ─────────────────────────────────────────────
// STEP 1: Install Supabase in your project
//   npm install @supabase/supabase-js
//
// STEP 2: Create src/supabaseClient.js with:
//   import { createClient } from '@supabase/supabase-js'
//   export const supabase = createClient(
//     'https://YOUR_PROJECT.supabase.co',
//     'YOUR_ANON_PUBLIC_KEY'
//   )
//
// STEP 3: Import it here as shown below
// ─────────────────────────────────────────────

import { useState } from "react";
// ✅ Correct: import the supabase client you created
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .ss-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #ffffff;
  }

  .ss-left {
    flex: 0 0 440px;
    display: flex;
    flex-direction: column;
    padding: 36px 48px 40px;
    position: relative;
    z-index: 2;
  }

  .ss-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: auto;
  }

  .ss-logo-icon { width: 34px; height: 34px; }

  .ss-logo-name {
    font-size: 17px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.3px;
  }

  .ss-form-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32px 0;
  }

  .ss-heading {
    font-family: 'Instrument Serif', serif;
    font-size: 34px;
    font-weight: 400;
    color: #0d0d0d;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .ss-subheading {
    font-size: 13.5px;
    color: #888;
    margin-bottom: 28px;
  }

  .ss-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    padding: 12px 14px;
    gap: 10px;
    margin-bottom: 14px;
    background: #fff;
    transition: border-color 0.2s;
  }

  .ss-input-wrap:focus-within { border-color: #3b82f6; }

  .ss-input-icon {
    color: #aaa;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .ss-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .ss-input-label {
    font-size: 11px;
    color: #aaa;
    font-weight: 500;
  }

  .ss-input {
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: #111;
    font-family: 'DM Sans', sans-serif;
    background: transparent;
    width: 100%;
  }

  .ss-check-icon {
    color: #22c55e;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .ss-eye-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #aaa;
    display: flex;
    align-items: center;
    padding: 0;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .ss-eye-btn:hover { color: #555; }

  .ss-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
    margin-bottom: 20px;
  }

  .ss-forgot-link {
    font-size: 12.5px;
    color: #2563eb;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-forgot-link:hover { text-decoration: underline; }

  .ss-btn {
    width: 100%;
    padding: 14px;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.1px;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.1s;
    margin-bottom: 22px;
  }

  .ss-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .ss-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  .ss-btn:active:not(:disabled) { transform: translateY(0); }

  .ss-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #bbb;
    font-size: 12.5px;
    margin-bottom: 18px;
  }

  .ss-divider::before,
  .ss-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ebebeb;
  }

  .ss-google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 0;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
    margin-bottom: 28px;
  }

  .ss-google-btn:hover {
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    border-color: #d0d0d0;
    transform: translateY(-1px);
  }

  .ss-switch-row {
    text-align: center;
    font-size: 13px;
    color: #888;
  }

  .ss-switch-link {
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    margin-left: 4px;
  }
  .ss-switch-link:hover { text-decoration: underline; }

  /* Error / success message */
  .ss-message {
    font-size: 13px;
    font-weight: 500;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 14px;
    text-align: center;
  }
  .ss-message.error  { background: #fef2f2; color: #dc2626; }
  .ss-message.success { background: #f0fdf4; color: #16a34a; }

  .ss-footer {
    font-size: 11.5px;
    color: #aaa;
    text-align: center;
    line-height: 1.6;
  }

  .ss-name-row { display: flex; gap: 12px; }
  .ss-name-row .ss-input-wrap { flex: 1; }

  .ss-right {
    flex: 1;
    background: linear-gradient(140deg, #d6eaf8 0%, #c5dff5 40%, #b8d4ee 70%, #a8c8e8 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 28px 0 0 28px;
  }

  .ss-right::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 80px),
      repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 80px);
    pointer-events: none;
  }

  .ss-safe-wrap {
    position: relative;
    animation: floatSafe 4s ease-in-out infinite;
    filter: drop-shadow(0 32px 48px rgba(60,100,160,0.25));
  }

  @keyframes floatSafe {
    0%, 100% { transform: translateY(0px) rotate(-4deg); }
    50%       { transform: translateY(-18px) rotate(-4deg); }
  }

  .ss-safe-svg { width: 260px; height: 260px; }
`;

/* ── SVG Safe ── */
function SafeIcon() {
  return (
    <svg className="ss-safe-svg" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="200" height="200" rx="36" fill="url(#bodyGrad)" />
      <rect x="30" y="30" width="200" height="200" rx="36" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
      <rect x="55" y="55" width="150" height="150" rx="22" fill="url(#innerGrad)" />
      <circle cx="130" cy="130" r="46" fill="url(#dialRingGrad)" />
      <circle cx="130" cy="130" r="46" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="3" />
      <circle cx="130" cy="130" r="34" fill="url(#dialFaceGrad)" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 130 + 28 * Math.cos(rad); const y1 = 130 + 28 * Math.sin(rad);
        const x2 = 130 + 32 * Math.cos(rad); const y2 = 130 + 32 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <circle cx="130" cy="130" r="8" fill="url(#knobGrad)" />
      <circle cx="130" cy="130" r="4" fill="#c8e0f4" />
      <line x1="130" y1="122" x2="108" y2="100" stroke="#c8dff0" strokeWidth="5" strokeLinecap="round" />
      <line x1="130" y1="122" x2="152" y2="100" stroke="#c8dff0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="108" cy="100" r="7" fill="#b8d4ec" stroke="#a0c0e0" strokeWidth="2" />
      <circle cx="152" cy="100" r="7" fill="#b8d4ec" stroke="#a0c0e0" strokeWidth="2" />
      <circle cx="218" cy="90" r="6" fill="url(#hingeGrad)" />
      <circle cx="218" cy="170" r="6" fill="url(#hingeGrad)" />
      <defs>
        <linearGradient id="bodyGrad" x1="30" y1="30" x2="230" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7db8e0" /><stop offset="100%" stopColor="#5a9ac8" />
        </linearGradient>
        <linearGradient id="innerGrad" x1="55" y1="55" x2="205" y2="205" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6aaed8" /><stop offset="100%" stopColor="#4e8ec0" />
        </linearGradient>
        <radialGradient id="dialRingGrad" cx="50%" cy="35%" r="65%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#8ec6e8" /><stop offset="100%" stopColor="#4a8abf" />
        </radialGradient>
        <radialGradient id="dialFaceGrad" cx="40%" cy="35%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#a8d8f0" /><stop offset="100%" stopColor="#5a9cc8" />
        </radialGradient>
        <radialGradient id="knobGrad" cx="40%" cy="30%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#c8e8f8" /><stop offset="100%" stopColor="#7ab8d8" />
        </radialGradient>
        <radialGradient id="hingeGrad" cx="40%" cy="30%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#d8eef8" /><stop offset="100%" stopColor="#8abcd8" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Icons ── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="3"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ── Main ── */
export default function SmartSaveLogin() {
  const [mode, setMode]                     = useState("signin");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName]           = useState("");
  const [lastName, setLastName]             = useState("");
  const [showPass, setShowPass]             = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState(null); // { type: 'error'|'success', text: '' }

  const isSignUp = mode === "signup";
   const navigate = useNavigate();
  // ✅ Correct: called by the Sign In button via onClick
  async function handleSignIn() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Signed in successfully! Redirecting…" });
      // TODO: redirect to dashboard, e.g. navigate('/dashboard')
      navigate('/dashboard');
    }
  }

  // ✅ Correct: called by the Create Account button via onClick
  async function handleSignUp() {
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }, // stored in user metadata
      },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Account created! Check your email to confirm." });
    }
  }

  // ✅ Correct: OAuth via Supabase — redirects to Google then back
  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // change to your post-login URL
      },
    });
    if (error) {
      setLoading(false);
      setMessage({ type: "error", text: error.message });
    }
    // page redirects automatically on success — no need to setLoading(false)
  }

  // ✅ Switch mode and clear state
  function switchMode(newMode) {
    setMode(newMode);
    setMessage(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ss-root">
        {/* LEFT */}
        <div className="ss-left">
          <div className="ss-logo">
            <svg className="ss-logo-icon" viewBox="0 0 34 34" fill="none">
              <path d="M4 18L12 8l6 7 5-5 7 10" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ss-logo-name">SmartSave</span>
          </div>

          <div className="ss-form-area">
            <h1 className="ss-heading">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
            <p className="ss-subheading">
              {isSignUp ? "Sign up to get started with SmartSave" : "Welcome back, please enter your details"}
            </p>

            {/* Error / success feedback */}
            {message && (
              <div className={`ss-message ${message.type}`}>{message.text}</div>
            )}

            {/* Name row — signup only */}
            {isSignUp && (
              <div className="ss-name-row">
                <div className="ss-input-wrap">
                  <span className="ss-input-icon"><UserIcon /></span>
                  <div className="ss-input-group">
                    <span className="ss-input-label">First Name</span>
                    <input className="ss-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Aswin" />
                  </div>
                </div>
                <div className="ss-input-wrap">
                  <span className="ss-input-icon"><UserIcon /></span>
                  <div className="ss-input-group">
                    <span className="ss-input-label">Last Name</span>
                    <input className="ss-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Kumar" />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="ss-input-wrap">
              <span className="ss-input-icon"><MailIcon /></span>
              <div className="ss-input-group">
                <span className="ss-input-label">Email Address</span>
                <input className="ss-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              {email.includes("@") && email.includes(".") && <span className="ss-check-icon"><CheckIcon /></span>}
            </div>

            {/* Password */}
            <div className="ss-input-wrap">
              <span className="ss-input-icon"><LockIcon /></span>
              <div className="ss-input-group">
                <span className="ss-input-label">Password</span>
                <input className="ss-input" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <button className="ss-eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                <EyeIcon off={showPass} />
              </button>
            </div>

            {/* Confirm Password — signup only */}
            {isSignUp && (
              <div className="ss-input-wrap">
                <span className="ss-input-icon"><LockIcon /></span>
                <div className="ss-input-group">
                  <span className="ss-input-label">Confirm Password</span>
                  <input className="ss-input" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <button className="ss-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  <EyeIcon off={showConfirm} />
                </button>
                {confirmPassword && password === confirmPassword && <span className="ss-check-icon"><CheckIcon /></span>}
              </div>
            )}

            {/* Forgot — sign in only */}
            {!isSignUp && (
              <div className="ss-forgot-row">
                <button className="ss-forgot-link">Forgot password?</button>
              </div>
            )}

            {/* ✅ onClick calls the correct handler directly */}
            <button
              className="ss-btn"
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign In"}
            </button>

            <div className="ss-divider">Or continue with</div>

            {/* ✅ Google OAuth via Supabase */}
            <button className="ss-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="ss-switch-row">
              {isSignUp
                ? (<>Already have an account?<button className="ss-switch-link" onClick={() => switchMode("signin")}>Sign In</button></>)
                : (<>Don't have an account?<button className="ss-switch-link" onClick={() => switchMode("signup")}>Sign Up</button></>)
              }
            </div>
          </div>

          <p className="ss-footer">
            Join the millions of smart investors who trust us to manage their field. Log in<br />
            to access your personalized dashboard, track your portfolio performance, and<br />
            make informed investment decisions.
          </p>
        </div>

        {/* RIGHT */}
        <div className="ss-right">
          <div className="ss-safe-wrap">
            <SafeIcon />
          </div>
        </div>
      </div>
    </>
  );
}