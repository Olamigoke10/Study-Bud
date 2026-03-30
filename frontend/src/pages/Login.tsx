import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, setTokens } from "../api/client";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tokens = await apiFetch<{ access: string; refresh?: string }>(
        "/auth/token/",
        {
          method: "POST",
          body: { username, password },
        }
      );

      setTokens(tokens);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Login</h1>

      {error ? (
        <div className="mt-4 rounded bg-red-500/10 p-3 text-red-200">{error}</div>
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
            autoComplete="current-password"
          />
        </label>

        <button
          disabled={loading}
          className="rounded bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-60"
          type="submit"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

