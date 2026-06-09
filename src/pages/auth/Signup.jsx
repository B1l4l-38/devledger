import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. You can now login.");
    setTimeout(() => navigate("/login"), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="text-sm text-violet-300">
          ← Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Create your ledger</h1>
        <p className="mt-2 text-slate-400">
          Start tracking your projects, progress, and public portfolio.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500"
          />

          <button className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-3 font-semibold text-white">
            Sign Up
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}