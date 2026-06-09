import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    logs: 0,
    completion: 0,
    profileStatus: "Incomplete",
  });

  const requiredFields = [
    "username",
    "full_name",
    "headline",
    "degree",
    "skills",
    "github_url",
    "linkedin_url",
    "instagram_url",
    "phone",
    "location",
    "bio",
    "portfolio_url",
    "cv_url",
  ];

  useEffect(() => {
    loadStats();
  }, []);

  function calculateCompletion(profile) {
    if (!profile) return 0;

    const completed = requiredFields.filter((key) => {
      const value = profile[key];

      if (Array.isArray(value)) return value.length > 0;

      return value && String(value).trim().length > 0;
    }).length;

    return Math.round((completed / requiredFields.length) * 100);
  }

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { count: projectCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: logCount } = await supabase
      .from("learning_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const completion = calculateCompletion(profile);

    setStats({
      projects: projectCount || 0,
      logs: logCount || 0,
      completion,
      profileStatus: completion === 100 ? "Completed" : `${completion}% Complete`,
    });
  }

  return (
    <div>
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
        <p className="text-sm font-medium text-violet-300">Dashboard</p>

        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white">
          Track your engineering growth like a product.
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          Manage your profile, portfolio projects, and technical learning logs
          from one clean developer workspace.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Total Projects</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            {stats.projects}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Learning Logs</p>
          <h2 className="mt-3 text-4xl font-bold text-white">{stats.logs}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Profile Status</p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            {stats.profileStatus}
          </h2>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${stats.completion}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}