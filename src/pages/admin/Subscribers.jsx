import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    username: "",
    full_name: "",
    headline: "",
    degree: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    github_url: "",
    linkedin_url: "",
    instagram_url: "",
    portfolio_url: "",
    cv_url: "",
    role: "user",
    status: "active",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, user_id, username, full_name, headline, degree, phone, location, bio, skills, github_url, linkedin_url, instagram_url, portfolio_url, cv_url, role, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (!error) setSubscribers(data || []);
  }

  const filteredSubscribers = subscribers.filter((user) =>
    `${user.username || ""} ${user.full_name || ""} ${user.headline || ""} ${
      user.degree || ""
    } ${user.location || ""} ${user.role || ""} ${user.status || ""} ${
      user.skills?.join(" ") || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(user) {
    setEditingId(user.id);
    setMessage("");

    setForm({
      username: user.username || "",
      full_name: user.full_name || "",
      headline: user.headline || "",
      degree: user.degree || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      skills: user.skills ? user.skills.join(", ") : "",
      github_url: user.github_url || "",
      linkedin_url: user.linkedin_url || "",
      instagram_url: user.instagram_url || "",
      portfolio_url: user.portfolio_url || "",
      cv_url: user.cv_url || "",
      role: user.role || "user",
      status: user.status || "active",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setMessage("");
    setForm(emptyForm);
  }

  async function updateSubscriber(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.username.trim().toLowerCase(),
        full_name: form.full_name.trim(),
        headline: form.headline.trim(),
        degree: form.degree.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        github_url: form.github_url.trim(),
        linkedin_url: form.linkedin_url.trim(),
        instagram_url: form.instagram_url.trim(),
        portfolio_url: form.portfolio_url.trim(),
        cv_url: form.cv_url.trim(),
        role: form.role,
        status: form.status,
        updated_at: new Date(),
      })
      .eq("id", editingId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Subscriber updated successfully.");
    cancelEdit();
    loadSubscribers();
  }

  async function updateStatus(profileId, status) {
    const { error } = await supabase
      .from("profiles")
      .update({ status, updated_at: new Date() })
      .eq("id", profileId);

    if (error) {
      setMessage(error.message);
      return;
    }

    loadSubscribers();
  }

  async function deleteUserData(userId) {
    const confirmDelete = window.confirm(
      "Delete this user's DevLedger data? This removes their profile, projects, and logs."
    );

    if (!confirmDelete) return;

    await supabase.from("learning_logs").delete().eq("user_id", userId);
    await supabase.from("projects").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);

    setMessage("User data deleted.");
    loadSubscribers();
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-violet-300">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Subscribers</h1>
          <p className="mt-2 text-slate-400">
            Search, update, suspend, activate, or delete user profile data.
          </p>
        </div>
      </div>

      {message && <p className="mt-5 text-sm text-cyan-300">{message}</p>}

      <input
        placeholder="Search subscribers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
      />

      {editingId && (
        <form
          onSubmit={updateSubscriber}
          className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit User Profile</h2>

            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["username", "Username"],
              ["full_name", "Full Name"],
              ["headline", "Professional Headline"],
              ["degree", "Degree"],
              ["phone", "Phone"],
              ["location", "Location"],
              ["skills", "Skills, comma separated"],
              ["github_url", "GitHub URL"],
              ["linkedin_url", "LinkedIn URL"],
              ["instagram_url", "Instagram URL"],
              ["portfolio_url", "Portfolio URL"],
              ["cv_url", "CV URL"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
              />
            ))}

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 text-white"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 text-white"
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="pending_review">pending_review</option>
            </select>
          </div>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="min-h-32 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <div className="flex gap-3">
            <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white">
              Save Changes
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

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="border-b border-white/10 bg-white/[0.03] text-sm text-slate-300">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Headline</th>
              <th className="p-4">Degree</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubscribers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/5 text-sm text-slate-300 last:border-0"
              >
                <td className="p-4 font-medium text-white">{user.username}</td>
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">{user.headline}</td>
                <td className="p-4">{user.degree}</td>
                <td className="p-4">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                    >
                      Edit
                    </button>

                    {user.status !== "suspended" ? (
                      <button
                        onClick={() => updateStatus(user.id, "suspended")}
                        className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-200 hover:bg-yellow-500/30"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(user.id, "active")}
                        className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-200 hover:bg-green-500/30"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => deleteUserData(user.user_id)}
                      className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-200 hover:bg-red-500/30"
                    >
                      Delete Data
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredSubscribers.length === 0 && (
              <tr>
                <td className="p-6 text-slate-400" colSpan="8">
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}