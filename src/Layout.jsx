import { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api";
import {
  Compass, Map, BookOpen, Star, Wallet, Tag, Users,
  Moon, Sun, Menu, X, ChevronDown, LogOut, User, Bell
} from "lucide-react";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("wanderlust_theme") === "dark";
  });
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wanderlust_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wanderlust_theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api("/auth/me");
        setUser(data.user);
      } catch (err) {
        setUser(null);
      }
    };
    loadUser();
   }, []);
   
   const navLinks = [
    { name: "Discover", page: "/discover", icon: Compass },
    { name: "Destinations", page: "/destinations", icon: Map },
    { name: "Plan Trip", page: "/plan-trips", icon: Map },
    { name: "Journal", page: "/journal", icon: BookOpen },
    { name: "Deals", page: "/deals", icon: Tag },
    { name: "Community", page: "/community", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <style>{`
        .nav-link-active { color: var(--accent) !important; }
        .nav-link-active::after { width: 100% !important; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 2px; background: var(--accent);
          transition: width 0.3s ease; border-radius: 2px;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: var(--accent); }
        .dropdown-menu {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-color)" }}
        className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/discover" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
              Wander<span style={{ color: "var(--accent)" }}>lust</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`relative nav-link px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(path) ? "nav-link-active" : ""}`}
                style={{ color: isActive(path) ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                    {user.full_name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-sm font-medium hidden sm:block" style={{ color: "var(--text-primary)" }}>
                    {user.full_name?.split(" ")[0] || "Me"}
                  </span>
                  <ChevronDown className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-12 w-48 rounded-2xl overflow-hidden dropdown-menu z-50">
                    <Link to="/profile"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:opacity-70"
                      style={{ color: "var(--text-primary)" }}
                      onClick={() => setUserDropdown(false)}>
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/plan-trips"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:opacity-70"
                      style={{ color: "var(--text-primary)" }}
                      onClick={() => setUserDropdown(false)}>
                      <Map className="w-4 h-4" /> My Trips
                    </Link>
                    <hr style={{ borderColor: "var(--border-color)" }} />
                    <button
                      onClick={async () =>{
                        await api("/auth/logout", { method: "POST" });
                        setUser(null);
                        navigate("/auth");
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-3 text-sm transition-colors hover:opacity-70"
                      style={{ color: "var(--text-primary)" }}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth"
                className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all btn-primary">
                Sign In
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 space-y-1" style={{ backgroundColor: "var(--bg-card)" }}>
            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(path) ? "nav-link-active" : ""}`}
                style={{
                  backgroundColor: isActive(path) ? "var(--accent-soft)" : "transparent",
                  color: isActive(path) ? "var(--accent)" : "var(--text-secondary)"
                }}>
                <Icon className="w-4 h-4" />
                {name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main onClick={() => { setUserDropdown(false); }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                <Compass className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                Wander<span style={{ color: "var(--accent)" }}>lust</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              © 2026 Wanderlust. Crafted with ❤️ for explorers everywhere.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              <a href="#" className="hover:opacity-70 transition-opacity">Privacy</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Terms</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}