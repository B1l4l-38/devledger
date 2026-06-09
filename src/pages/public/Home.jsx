import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, Rocket } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import SpaceBackground from "../../components/SpaceBackground";
import AppNavbar from "../../components/AppNavbar";

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
      if (currentSession?.user) loadProfile(currentSession.user.id);
      else setProfile(null);
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

      <AppNavbar
        isLight={isLight}
        setTheme={setTheme}
        session={session}
        displayName={displayName}
        variant="public"
      />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <section className="max-w-4xl">
          <p className="flex items-center gap-2 text-sm font-medium text-violet-500">
            <Rocket size={16} />
            Developer Portfolio & Learning OS
          </p>

          <h1
            className={
              isLight
                ? "mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-7xl"
                : "mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl"
            }
          >
            Build a public record of your technical growth.
          </h1>

          <p
            className={
              isLight
                ? "mt-6 max-w-2xl text-base text-slate-700 sm:text-lg"
                : "mt-6 max-w-2xl text-base text-slate-400 sm:text-lg"
            }
          >
            DevLedger helps developers showcase projects, document learning logs,
            and share a professional public profile without building a portfolio
            from scratch.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/explore"
              className={
                isLight
                  ? "w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-center font-medium text-slate-800 shadow-sm hover:bg-slate-100 sm:w-auto"
                  : "w-full rounded-full border border-white/10 bg-white/10 px-6 py-3 text-center font-medium text-white hover:bg-white/15 sm:w-auto"
              }
            >
              Explore Developers
            </Link>

            <Link
              to={session ? "/dashboard/profile" : "/signup"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 sm:w-auto"
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