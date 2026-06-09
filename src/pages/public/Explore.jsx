import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserRound,
  GraduationCap,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import SpaceBackground from "../../components/SpaceBackground";
import Logo from "../../components/Logo";

<Logo />

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
      } app-bg relative min-h-screen overflow-hidden px-6 py-10`}
    >
      {isLight ? (
        <div className="light-aurora pointer-events-none" />
      ) : (
        <SpaceBackground />
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className={
              isLight
                ? "text-sm font-medium text-slate-700 hover:text-slate-950"
                : "text-sm text-violet-300 hover:text-violet-200"
            }
          >
            ← Home
          </Link>

          <div className="flex items-center gap-3">
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

            <Link
              to="/signup"
              className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
            >
              Create Profile
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <p className="flex items-center gap-2 text-sm font-medium text-violet-500">
            <Sparkles size={16} />
            Public Developer Network
          </p>

          <h1
            className={
              isLight
                ? "mt-3 text-4xl font-bold text-slate-950"
                : "mt-3 text-4xl font-bold text-white"
            }
          >
            Explore Developers
          </h1>

          <p
            className={
              isLight
                ? "mt-3 max-w-2xl text-slate-700"
                : "mt-3 max-w-2xl text-slate-400"
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

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                    ? "rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300"
                    : "rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06]"
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
                      ? "mt-2 text-xl font-bold text-slate-950"
                      : "mt-2 text-xl font-bold text-white"
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

        {filteredProfiles.length === 0 && (
          <div
            className={
              isLight
                ? "mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-800"
                : "mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center"
            }
          >
            <h2 className="text-xl font-bold">No developers found</h2>
            <p
              className={
                isLight ? "mt-2 text-slate-600" : "mt-2 text-slate-400"
              }
            >
              Try searching by another name, skill, or username.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}