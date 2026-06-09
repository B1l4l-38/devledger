import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    title: "",
    description: "",
    scope: "",
    tech_stack: "",
    repo_url: "",
    live_url: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function startEdit(project) {
    setEditingId(project.id);
    setShowForm(true);
    setMessage("");

    setForm({
      title: project.title || "",
      description: project.description || "",
      scope: project.scope || "",
      tech_stack: project.tech_stack ? project.tech_stack.join(", ") : "",
      repo_url: project.repo_url || "",
      live_url: project.live_url || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
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

    const projectData = {
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      scope: form.scope.trim(),
      tech_stack: form.tech_stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      repo_url: form.repo_url.trim(),
      live_url: form.live_url.trim(),
      updated_at: new Date(),
    };

    if (!projectData.title) {
      setMessage("Project title is required.");
      return;
    }

    let error;

    if (editingId) {
      const result = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId)
        .eq("user_id", user.id);

      error = result.error;
    } else {
      const result = await supabase.from("projects").insert(projectData);
      error = result.error;
    }

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(editingId ? "Project updated successfully." : "Project added successfully.");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
    loadProjects();
  }

  async function deleteProject(id) {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-violet-300">Portfolio</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Projects</h1>
          <p className="mt-2 text-slate-400">
            Manage your portfolio projects. Add new projects only when needed.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="w-fit rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/20"
        >
          Add New Project
        </button>
      </div>

      {message && <p className="mt-5 text-sm text-cyan-300">{message}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid max-w-3xl gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-violet-950/20"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Project" : "Add Project"}
            </h2>

            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <input
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <textarea
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <textarea
            name="scope"
            placeholder="Project Scope / Business Goal"
            value={form.scope}
            onChange={handleChange}
            className="min-h-24 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <input
            name="tech_stack"
            placeholder="Tech Stack, comma separated"
            value={form.tech_stack}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="repo_url"
              placeholder="GitHub Repository URL"
              value={form.repo_url}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
            />

            <input
              name="live_url"
              placeholder="Live Demo URL"
              value={form.live_url}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3">
            <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white">
              {editingId ? "Update Project" : "Save Project"}
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-2xl border border-white/10 px-5 py-3 text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-400/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                <p className="mt-2 text-slate-400">{project.description}</p>
              </div>
            </div>

            {project.scope && (
              <p className="mt-4 rounded-2xl bg-white/[0.03] p-4 text-sm text-slate-300">
                {project.scope}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech_stack?.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                >
                  Repository
                </a>
              )}

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                >
                  Live Demo
                </a>
              )}

              <button
                onClick={() => startEdit(project)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProject(project.id)}
                className="rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-200 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && !showForm && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center md:col-span-2">
            <h2 className="text-xl font-bold text-white">No projects yet</h2>
            <p className="mt-2 text-slate-400">
              Add your first portfolio project to start building your public ledger.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white"
            >
              Add First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}