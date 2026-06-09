import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
  Phone,
  Save,
  UserRound,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
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
  });

  const requiredFields = [
    { key: "username", label: "Username" },
    { key: "full_name", label: "Full name" },
    { key: "headline", label: "Professional headline" },
    { key: "degree", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "github_url", label: "GitHub" },
    { key: "linkedin_url", label: "LinkedIn" },
    { key: "instagram_url", label: "Instagram" },
    { key: "phone", label: "Phone" },
    { key: "location", label: "Location" },
    { key: "bio", label: "Bio" },
    { key: "portfolio_url", label: "Portfolio URL" },
    { key: "cv_url", label: "CV URL" },
  ];

  const completion = useMemo(() => {
    const completed = requiredFields.filter((item) => {
      const value = form[item.key];
      return value && value.trim().length > 0;
    }).length;

    return Math.round((completed / requiredFields.length) * 100);
  }, [form]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setForm({
        username: data.username || "",
        full_name: data.full_name || "",
        headline: data.headline || "",
        degree: data.degree || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        skills: data.skills ? data.skills.join(", ") : "",
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || "",
        instagram_url: data.instagram_url || "",
        portfolio_url: data.portfolio_url || "",
        cv_url: data.cv_url || "",
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

    const profileData = {
      user_id: user.id,
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
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "user_id" });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile saved successfully.");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-300">
        <Loader2 className="animate-spin" size={18} />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-violet-300">
            <UserRound size={16} />
            Public Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Profile Settings
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Complete your profile so your public developer page looks
            professional and recruiter-ready.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:w-80">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">
              Profile Completion
            </p>
            <p className="text-sm font-semibold text-cyan-300">
              {completion}%
            </p>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            100% requires social links, contact info, portfolio link, and CV URL.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              icon={<UserRound size={17} />}
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            <Input
              icon={<UserRound size={17} />}
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
            />

            <Input
              icon={<BriefcaseBusiness size={17} />}
              name="headline"
              placeholder="Professional Headline"
              value={form.headline}
              onChange={handleChange}
            />

            <Input
              icon={<GraduationCap size={17} />}
              name="degree"
              placeholder="Degree / Education"
              value={form.degree}
              onChange={handleChange}
            />

            <Input
              icon={<Phone size={17} />}
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              icon={<MapPin size={17} />}
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <Input
              icon={<span className="text-base">🐙</span>}
              name="github_url"
              placeholder="GitHub URL"
              value={form.github_url}
              onChange={handleChange}
            />

            <Input
              icon={<span className="text-base">💼</span>}
              name="linkedin_url"
              placeholder="LinkedIn URL"
              value={form.linkedin_url}
              onChange={handleChange}
            />

            <Input
              icon={<span className="text-base">📷</span>}
              name="instagram_url"
              placeholder="Instagram URL"
              value={form.instagram_url}
              onChange={handleChange}
            />

            <Input
              icon={<Link2 size={17} />}
              name="portfolio_url"
              placeholder="Portfolio URL"
              value={form.portfolio_url}
              onChange={handleChange}
            />

            <Input
              icon={<FileText size={17} />}
              name="cv_url"
              placeholder="CV URL"
              value={form.cv_url}
              onChange={handleChange}
            />

            <Input
              icon={<CheckCircle2 size={17} />}
              name="skills"
              placeholder="Skills, comma separated"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="bio"
            placeholder="Short Bio / About You"
            value={form.bio}
            onChange={handleChange}
            className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-violet-400/50"
          />

          <button className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5">
            <Save size={18} />
            Save Profile
          </button>

          {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}
        </form>

        
      </div>
    </div>
  );
}

function Input({ icon, name, placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition focus-within:border-violet-400/50 hover:border-white/20">
      <span className="text-slate-500">{icon}</span>

      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-white placeholder:text-slate-500"
      />
    </div>
  );
}