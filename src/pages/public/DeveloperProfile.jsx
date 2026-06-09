import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  Link2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import SpaceBackground from "../../components/SpaceBackground";
import Logo from "../../components/Logo";

<Logo />

export default function DeveloperProfile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme] = useState(localStorage.getItem("devledger-theme") || "dark");

  const isLight = theme === "light";

  useEffect(() => {
    loadPublicProfile();
  }, [username]);

  async function loadPublicProfile() {
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", decodeURIComponent(username).trim().toLowerCase())
      .single();

    if (profileError || !profileData) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(profileData);

    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", profileData.user_id)
      .order("created_at", { ascending: false });

    const { data: logData } = await supabase
      .from("learning_logs")
      .select("*, projects(title)")
      .eq("user_id", profileData.user_id)
      .order("created_at", { ascending: false });

    setProjects(projectData || []);
    setLogs(logData || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        className={`${
          isLight ? "theme-light" : "theme-dark"
        } app-bg relative min-h-screen overflow-hidden p-10`}
      >
        {isLight ? (
          <div className="light-aurora pointer-events-none" />
        ) : (
          <SpaceBackground />
        )}

        <div className="relative z-10">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`${
          isLight ? "theme-light" : "theme-dark"
        } app-bg relative min-h-screen overflow-hidden p-10`}
      >
        {isLight ? (
          <div className="light-aurora pointer-events-none" />
        ) : (
          <SpaceBackground />
        )}

        <div className="relative z-10">
          <Link
            to="/explore"
            className={
              isLight
                ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm hover:bg-slate-100"
                : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
            }
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <h1
            className={
              isLight
                ? "mt-8 text-3xl font-bold text-slate-950"
                : "mt-8 text-3xl font-bold text-white"
            }
          >
            Profile not found.
          </h1>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Link
            to="/explore"
            className={
              isLight
                ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm hover:bg-slate-100"
                : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            }
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <Link
            to="/"
            className={
              isLight
                ? "rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-white hover:text-slate-950"
                : "rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            }
          >
            Home
          </Link>
        </div>

        <section
          className={
            isLight
              ? "mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70 transition duration-300 hover:border-violet-300"
              : "mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-violet-950/20 backdrop-blur-xl transition duration-300 hover:border-violet-400/40"
          }
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30">
                <UserRound size={30} />
              </div>

              <p className="mt-6 text-sm font-medium text-violet-500">
                @{profile.username || "no-username"}
              </p>

              <h1
                className={
                  isLight
                    ? "mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl"
                    : "mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl"
                }
              >
                {profile.full_name || "Unnamed Developer"}
              </h1>

              {profile.headline && (
                <p
                  className={
                    isLight
                      ? "mt-4 max-w-2xl text-lg text-slate-700"
                      : "mt-4 max-w-2xl text-lg text-slate-300"
                  }
                >
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p
                  className={
                    isLight
                      ? "mt-4 max-w-3xl text-slate-600"
                      : "mt-4 max-w-3xl text-slate-400"
                  }
                >
                  {profile.bio}
                </p>
              )}

              <div
                className={
                  isLight
                    ? "mt-5 flex flex-wrap gap-4 text-sm text-slate-600"
                    : "mt-5 flex flex-wrap gap-4 text-sm text-slate-400"
                }
              >
                {profile.degree && (
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    {profile.degree}
                  </span>
                )}

                {profile.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {profile.location}
                  </span>
                )}

                {profile.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    isLight
                      ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  }
                >
                  <span>🐙</span>
                  GitHub
                </a>
              )}

              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    isLight
                      ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  }
                >
                  <span>💼</span>
                  LinkedIn
                </a>
              )}

              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    isLight
                      ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  }
                >
                  <span>📷</span>
                  Instagram
                </a>
              )}

              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    isLight
                      ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                  }
                >
                  <ExternalLink size={16} />
                  Portfolio
                </a>
              )}

              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <Link2 size={16} />
                  View CV
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className={
                  isLight
                    ? "rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-800"
                    : "rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200"
                }
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}