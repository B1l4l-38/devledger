import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  FolderKanban,
  BookOpen,
  Shield,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Search,
} from "lucide-react";
import Logo from "./Logo";

export default function AppNavbar({
  isLight,
  setTheme,
  isAdmin = false,
  session = null,
  displayName = "",
  onLogout = null,
  variant = "public",
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 text-white"
        : isLight
        ? "text-slate-700 hover:bg-white hover:text-slate-950"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const dashboardLinks = (
    <>
      <NavLink to="/dashboard" end className={navClass}>
        <Home size={16} /> Home
      </NavLink>
      <NavLink to="/dashboard/projects" className={navClass}>
        <FolderKanban size={16} /> Projects
      </NavLink>
      <NavLink to="/dashboard/logs" className={navClass}>
        <BookOpen size={16} /> Logs
      </NavLink>
      <NavLink to="/dashboard/profile" className={navClass}>
        <User size={16} /> Profile
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin/subscribers" className={navClass}>
          <Shield size={16} /> Admin
        </NavLink>
      )}
    </>
  );

  const publicLinks = (
    <>
      <Link
        to="/explore"
        className={
          isLight
            ? "flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            : "flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        }
      >
        <Search size={16} />
        Explore
      </Link>

      {session ? (
        <Link
          to="/dashboard"
          className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/login"
            className={
              isLight
                ? "text-sm text-slate-700 hover:text-slate-950"
                : "text-sm text-slate-300 hover:text-white"
            }
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Create
          </Link>
        </>
      )}
    </>
  );

  return (
    <header
      className={
        isLight
          ? "sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
          : "sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-2 lg:flex">
          {variant === "dashboard" ? dashboardLinks : publicLinks}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {variant === "public" && session && displayName && (
            <span
              className={
                isLight
                  ? "text-sm text-slate-700"
                  : "text-sm text-slate-300"
              }
            >
              Welcome, {displayName}
            </span>
          )}

          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={
              isLight
                ? "rounded-full border border-slate-200 bg-white p-2 text-slate-800 shadow-sm hover:bg-slate-100"
                : "rounded-full border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15"
            }
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {variant === "dashboard" && onLogout && (
            <button
              onClick={onLogout}
              className={
                isLight
                  ? "flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  : "flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white"
              }
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={
              isLight
                ? "rounded-full border border-slate-200 bg-white p-2 text-slate-800"
                : "rounded-full border border-white/10 bg-white/10 p-2 text-white"
            }
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={
              isLight
                ? "rounded-full border border-slate-200 bg-white p-2 text-slate-800"
                : "rounded-full border border-white/10 bg-white/10 p-2 text-white"
            }
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={
            isLight
              ? "border-t border-slate-200 bg-white/95 px-4 py-4 lg:hidden"
              : "border-t border-white/10 bg-[#020617]/95 px-4 py-4 lg:hidden"
          }
        >
          <nav className="grid gap-2">
            {variant === "dashboard" ? dashboardLinks : publicLinks}

            {variant === "dashboard" && onLogout && (
              <button
                onClick={onLogout}
                className={
                  isLight
                    ? "mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                    : "mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white"
                }
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}