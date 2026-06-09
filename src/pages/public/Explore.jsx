import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, GraduationCap, Sparkles } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import SpaceBackground from "../../components/SpaceBackground";
import AppNavbar from "../../components/AppNavbar";

export default function Explore() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("devledger-theme") || "dark"
  );

  const isLight = theme === "light";

  useEffect(() => {
    localStorage.setItem("devledger-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, full_name, degree, skills, headline, location")
      .order("created_at", { ascending: false });

    if (!error) setProfiles(data || []);
  }

  const filteredProfiles = profiles.filter((profile) =>
    `${profile.username || ""} ${profile.full_name || ""} ${
      profile.degree || ""
    } ${profile.headline || ""} ${profile.location || ""} ${
      profile.skills?.join(" ") || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

      <AppNavbar isLight={isLight} setTheme={setTheme} variant="public" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-violet-500">
            <Sparkles size={16} />
            Public Developer Network
          </p>

          <h1
            className={
              isLight
                ? "mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
                : "mt-3 text-3xl font-bold text-white sm:text-4xl"
            }
          >
            Explore Developers
          </h1>

          <p
            className={
              isLight
                ? "mt-3 max-w-2xl text-sm text-slate-700 sm:text-base"
                : "mt-3 max-w-2xl text-sm text-slate-400 sm:text-base"
            }
          >
            Search public DevLedger profiles by name, username, skill, degree,
            headline, or location.
          </p>
        </div>

        <div className="relative mt-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            placeholder="Search developers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={
              isLight
                ? "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-12 text-slate-950 shadow-sm placeholder:text-slate-500 focus:border-violet-400"
                : "w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
            }
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles
            .filter((profile) => profile.username)
            .map((profile) => (
              <Link
                key={profile.id}
                to={`/dev/${encodeURIComponent(
                  profile.username.trim().toLowerCase()
                )}`}
                className={
                  isLight
                    ? "rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-xl shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 sm:p-6"
                    : "rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06] sm:p-6"
                }
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600">
                  <UserRound size={22} />
                </div>

                <p className="mt-5 text-sm font-medium text-violet-500">
                  @{profile.username}
                </p>

                <h2
                  className={
                    isLight
                      ? "mt-2 text-lg font-bold text-slate-950 sm:text-xl"
                      : "mt-2 text-lg font-bold text-white sm:text-xl"
                  }
                >
                  {profile.full_name || "Unnamed Developer"}
                </h2>

                {profile.headline && (
                  <p
                    className={
                      isLight
                        ? "mt-2 text-sm text-slate-700"
                        : "mt-2 text-sm text-slate-300"
                    }
                  >
                    {profile.headline}
                  </p>
                )}

                <p
                  className={
                    isLight
                      ? "mt-3 flex items-center gap-2 text-sm text-slate-600"
                      : "mt-3 flex items-center gap-2 text-sm text-slate-400"
                  }
                >
                  <GraduationCap size={15} />
                  {profile.degree || "No degree added"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.skills?.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className={
                        isLight
                          ? "rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800"
                          : "rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200"
                      }
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}