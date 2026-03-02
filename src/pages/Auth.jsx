import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

import {
  Eye,
  EyeOff,
  Compass,
  Check,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

/* ================= PASSWORD STRENGTH ================= */

function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Lowercase letter", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;

  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i <= score ? colors[score] : "var(--border-color)",
            }}
          />
        ))}
      </div>

      <p className="text-xs font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </p>

      <div className="grid grid-cols-2 gap-1">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {c.pass ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X
                className="w-3 h-3"
                style={{ color: "var(--text-muted)" }}
              />
            )}
            <span
              className="text-xs"
              style={{
                color: c.pass
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= AUTH COMPONENT ================= */

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLE AUTH ================= */

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Please enter your full name.");
      return;
    }

    if (mode === "signup") {
      const strong =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

      if (!strong) {
        setError("Password is too weak.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "signin" ? "/auth/login" : "/auth/register";

      await api(endpoint, {
        method: "POST",
        body: JSON.stringify(
          mode === "signin"
            ? { email, password }
            : { full_name: name, email, password }
        ),
      });

      navigate("/discover");
    } catch (err) {
      setError(err.message || "Authentication failed.");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* LEFT SIDE IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold mb-2">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>

          {/* TOGGLE */}
          <div className="flex rounded-2xl p-1 mb-6 bg-gray-100">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
                  mode === m ? "bg-white shadow" : ""
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleAuth} className="space-y-4">

            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {mode === "signup" && (
              <PasswordStrength password={password} />
            )}

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}