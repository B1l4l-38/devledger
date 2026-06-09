import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, Rocket, Moon, Sun } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import SpaceBackground from "../../components/SpaceBackground";
import Logo from "../../components/Logo";

export default function Home() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("devledger-theme") || "dark"
  );

  const isLight = theme === "light";

  useEffect(() => {
    localStorage.setItem("devledger-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);

      if (currentSession?.user) {
        loadProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadSession() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    if (data.session?.user) {
      loadProfile(data.session.user.id);
    }
  }

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("user_id", userId)
      .single();

    setProfile(data);
  }

  const displayName =
    profile?.full_name ||
    profile?.username ||
    session?.user?.email ||
    "Developer";

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
            ? "relative z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
            : "relative z-10 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl"
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav className="flex items-center gap-3">
            <Link
              to="/explore"
              className={
                isLight
                  ? "flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  : "flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
              }
            >
              <Search size={16} />
              Explore
            </Link>

            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={
                isLight
                  ? "rounded-full border border-slate-200 bg-white p-2 text-slate-800 shadow-sm hover:bg-slate-100"
                  : "rounded-full border border-white/10 bg-white/10 p-2 text-white hover:bg-white/15"
              }
              title="Toggle theme"
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {session ? (
              <>
                <span
                  className={
                    isLight
                      ? "hidden text-sm text-slate-700 md:block"
                      : "hidden text-sm text-slate-300 md:block"
                  }
                >
                  Welcome, {displayName}
                </span>

                <Link
                  to="/dashboard"
                  className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
                >
                  Dashboard
                </Link>
              </>
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
                  className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
                >
                  Create Profile
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <section className="max-w-4xl">
          <p className="flex items-center gap-2 text-sm font-medium text-violet-500">
            <Rocket size={16} />
            Developer Portfolio & Learning OS
          </p>

          <h1
            className={
              isLight
                ? "mt-5 text-5xl font-bold tracking-tight text-slate-950 md:text-7xl"
                : "mt-5 text-5xl font-bold tracking-tight text-white md:text-7xl"
            }
          >
            Build a public record of your technical growth.
          </h1>

          <p
            className={
              isLight
                ? "mt-6 max-w-2xl text-lg text-slate-700"
                : "mt-6 max-w-2xl text-lg text-slate-400"
            }
          >
            DevLedger helps developers showcase projects, document learning logs,
            and share a professional public profile without building a portfolio
            from scratch.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/explore"
              className={
                isLight
                  ? "rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-slate-800 shadow-sm hover:bg-slate-100"
                  : "rounded-full border border-white/10 bg-white/10 px-6 py-3 font-medium text-white hover:bg-white/15"
              }
            >
              Explore Developers
            </Link>

            <Link
              to={session ? "/dashboard/profile" : "/signup"}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              <UserRound size={18} />
              {session ? "View Your Profile" : "Create Your Profile"}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}