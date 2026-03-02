import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Eye, EyeOff, Compass, Check, X, ArrowRight, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : "var(--border-color)" }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[score] }}>{labels[score]}</p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {c.pass ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />}
            <span className="text-xs" style={{ color: c.pass ? "var(--text-primary)" : "var(--text-muted)" }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await base44.auth.redirectToLogin(createPageUrl("Discover"));
      } else {
        await base44.auth.redirectToLogin(createPageUrl("Discover"));
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl("Discover"));
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(26,26,46,0.85), rgba(15,52,96,0.7))" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #e8673a, #3a6ee8)" }}>
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Wanderlust</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your next great<br />adventure awaits
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Discover personalized destinations, plan unforgettable trips, and connect with fellow explorers.
          </p>
          <div className="flex gap-4 mt-8">
            {["1000+ Destinations", "500K+ Travelers", "50K+ Reviews"].map(stat => (
              <div key={stat} className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Wanderlust</span>
          </div>

          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {mode === "signin" ? "Welcome back" : "Start exploring"}
          </h1>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            {mode === "signin" ? "Sign in to your Wanderlust account" : "Create your free account today"}
          </p>

          {/* Toggle */}
          <div className="flex rounded-2xl p-1 mb-8" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {["signin", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: mode === m ? "var(--bg-card)" : "transparent",
                  color: mode === m ? "var(--text-primary)" : "var(--text-muted)",
                  boxShadow: mode === m ? "var(--shadow)" : "none"
                }}>
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google Button */}
          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border text-sm font-medium mb-6 transition-all hover:opacity-80"
            style={{ borderColor: "var(--border-color)", color: "var(--text-primary)", backgroundColor: "var(--bg-card)" }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1" style={{ borderColor: "var(--border-color)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or continue with email</span>
            <hr className="flex-1" style={{ borderColor: "var(--border-color)" }} />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Chloe Martin"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="chloe@example.com"
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-2xl text-sm outline-none transition-all"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && <PasswordStrength password={password} />}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-2xl text-sm" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                {error}
              </div>
            )}

            <button type="button" onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 btn-primary mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{mode === "signin" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
            By continuing, you agree to our{" "}
            <a href="#" style={{ color: "var(--accent)" }} className="hover:underline">Terms</a> and{" "}
            <a href="#" style={{ color: "var(--accent)" }} className="hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}