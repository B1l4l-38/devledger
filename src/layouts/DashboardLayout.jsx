import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  FolderKanban,
  BookOpen,
  Shield,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { supabase } from "../services/supabaseClient";
import SpaceBackground from "../components/SpaceBackground";
import Logo from "../components/Logo";

<Logo />

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("devledger-theme") || "dark"
  );

  const isLight = theme === "light";

  useEffect(() => {
    checkRole();
  }, []);

  useEffect(() => {
    localStorage.setItem("devledger-theme", theme);
  }, [theme]);

  async function checkRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    setIsAdmin(data?.role === "admin");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-violet-500/20"
        : isLight
        ? "text-slate-700 hover:bg-white hover:text-slate-950"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div
      className={`${
        isLight ? "theme-light" : "theme-dark"
      } app-bg relative min-h-screen overflow-hidden`}
    >
      {isLight ? (
        <div className="light-aurora pointer-events-none" />
      ) : (
        <SpaceBackground />
      )}

      <header
        className={
          isLight
            ? "sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
            : "sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl"
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
           <NavLink to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                DL
              </div>

              <div>
                <h1
                  className={
                    isLight
                      ? "text-sm font-semibold text-slate-950"
                      : "text-sm font-semibold text-white"
                  }
                >
                  DevLedger
                </h1>
                <p
                  className={
                    isLight ? "text-xs text-slate-600" : "text-xs text-slate-400"
                  }
                >
                  Portfolio OS
                </p>
              </div>
            </NavLink>

            <nav className="hidden items-center gap-2 lg:flex">
              <NavLink to="/dashboard" end className={navClass}>
                <Home size={16} /> Home
              </NavLink>

              <NavLink to="/dashboard/projects" className={navClass}>
                <FolderKanban size={16} /> Projects
              </NavLink>

              <NavLink to="/dashboard/logs" className={navClass}>
                <BookOpen size={16} /> Logs
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin/subscribers" className={navClass}>
                  <Shield size={16} /> Admin
                </NavLink>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/dashboard/profile" className={navClass}>
              <User size={16} /> Profile
            </NavLink>

            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={
                isLight
                  ? "rounded-full border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-100"
                  : "rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/15"
              }
              title="Toggle theme"
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={handleLogout}
              className={
                isLight
                  ? "flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                  : "flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              }
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}