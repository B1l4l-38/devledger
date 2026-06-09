import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
        DL
      </div>

      <div>
        <h1 className="text-sm font-semibold">DevLedger</h1>
        <p className="text-xs opacity-70">Portfolio OS</p>
      </div>
    </Link>
  );
}