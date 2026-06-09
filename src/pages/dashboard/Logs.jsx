import { useEffect, useState } from "react";
import {
  BookOpen,
  Bug,
  FileText,
  FlaskConical,
  Link2,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    project_id: "",
    blocker: "",
    research: "",
    roadblocks: "",
    resolution: "",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadProjects();
    loadLogs();
  }, []);

  async function loadProjects() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
  }

  async function loadLogs() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("learning_logs")
      .select("*, projects(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setLogs(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateForm() {
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function closeForm() {
    setForm(emptyForm);
    setShowForm(false);
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in.");
      return;
    }

    const logData = {
      user_id: user.id,
      project_id: form.project_id || null,
      blocker: form.blocker.trim(),
      research: form.research.trim(),
      roadblocks: form.roadblocks.trim(),
      resolution: form.resolution.trim(),
      notes: form.notes.trim(),
    };

    if (!logData.blocker || !logData.resolution) {
      setMessage("Problem and resolution are required.");
      return;
    }

    const { error } = await supabase.from("learning_logs").insert(logData);

    if (error) {
      setMessage(error.message);
      return;
    }

    setForm(emptyForm);
    setShowForm(false);
    setMessage("Learning log added successfully.");
    loadLogs();
  }

  async function deleteLog(id) {
    const confirmDelete = window.confirm("Delete this learning log?");
    if (!confirmDelete) return;

    await supabase.from("learning_logs").delete().eq("id", id);
    loadLogs();
  }

  return (
    <div className="animate-[fadeIn_0.35s_ease]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-violet-300">
            <BookOpen size={16} />
            Engineering Journal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">Learning Logs</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Document technical blockers, research, roadblocks, and final fixes.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20"
        >
          <Plus size={18} />
          Add New Log
        </button>
      </div>

      {message && (
        <p className="mt-5 flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
          <CheckCircle2 size={16} />
          {message}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid max-w-3xl gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <FileText size={20} />
              Add Learning Log
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:scale-105 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 text-white shadow-inner shadow-black/20 transition focus:border-violet-400/50"
          >
            <option className="bg-[#020617] text-white" value="">
              No linked project
            </option>

            {projects.map((project) => (
              <option
                className="bg-[#020617] text-white"
                key={project.id}
                value={project.id}
              >
                {project.title}
              </option>
            ))}
          </select>

          <textarea
            name="blocker"
            placeholder="Problem / Blocker"
            value={form.blocker}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <textarea
            name="research"
            placeholder="Research / What did you try?"
            value={form.research}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <textarea
            name="roadblocks"
            placeholder="Roadblocks / Issues faced"
            value={form.roadblocks}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <textarea
            name="resolution"
            placeholder="Resolution / Final fix"
            value={form.resolution}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <textarea
            name="notes"
            placeholder="Extra notes / useful links"
            value={form.notes}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5">
              <CheckCircle2 size={18} />
              Save Log
            </button>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl border border-white/10 px-5 py-3 text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-5">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06]"
          >
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-sm text-slate-500">
                  {new Date(log.created_at).toLocaleString()}
                </p>

                {log.projects?.title && (
                  <p className="mt-2 flex w-fit items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                    <Link2 size={13} />
                    {log.projects.title}
                  </p>
                )}
              </div>

              <button
                onClick={() => deleteLog(log.id)}
                className="flex w-fit items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/30"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                <h2 className="flex items-center gap-2 font-semibold text-white">
                  <Bug size={16} />
                  Problem
                </h2>
                <p className="mt-2 text-sm text-slate-400">{log.blocker}</p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                <h2 className="flex items-center gap-2 font-semibold text-white">
                  <CheckCircle2 size={16} />
                  Resolution
                </h2>
                <p className="mt-2 text-sm text-slate-400">{log.resolution}</p>
              </div>

              {log.research && (
                <div className="rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    <FlaskConical size={16} />
                    Research
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {log.research}
                  </p>
                </div>
              )}

              {log.roadblocks && (
                <div className="rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05]">
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    <AlertTriangle size={16} />
                    Roadblocks
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {log.roadblocks}
                  </p>
                </div>
              )}

              {log.notes && (
                <div className="rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05] md:col-span-2">
                  <h2 className="flex items-center gap-2 font-semibold text-white">
                    <FileText size={16} />
                    Notes
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{log.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {logs.length === 0 && !showForm && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center transition hover:border-violet-400/40">
            <h2 className="text-xl font-bold text-white">No learning logs yet</h2>
            <p className="mt-2 text-slate-400">
              Add your first engineering log to start documenting your progress.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Add First Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}