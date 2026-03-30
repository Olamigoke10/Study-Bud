import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await apiFetch("/auth/register/", {
        method: "POST",
        body: { username, password },
      });
      setSuccess("Account created. Redirecting...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Register</h1>

      {error ? (
        <div className="mt-4 rounded bg-red-500/10 p-3 text-red-200">{error}</div>
      ) : null}
      {success ? (
        <div className="mt-4 rounded bg-green-500/10 p-3 text-green-200">{success}</div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-zinc-300">Username</span>
          <input
            className="rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            autoComplete="username"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-zinc-300">Password</span>
          <input
            className="rounded border border-zinc-700 bg-zinc-900 p-2 text-zinc-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            autoComplete="new-password"
          />
        </label>

        <button
          disabled={loading}
          className="rounded bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-60"
          type="submit"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

