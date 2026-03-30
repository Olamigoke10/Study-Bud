import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

type Room = {
  id: number;
  name: string;
  description?: string | null;
};

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Room[]>("/rooms/")
      .then(setRooms)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Study Rooms</h1>

      {error ? (
        <div className="mt-4 rounded bg-red-500/10 p-3 text-red-200">{error}</div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {rooms.map((r) => (
          <Link
            key={r.id}
            to={`/room/${r.id}`}
            className="rounded border border-zinc-700 bg-zinc-900/60 p-4 hover:bg-zinc-800/50"
          >
            <div className="text-lg font-semibold">{r.name}</div>
            {r.description ? <div className="mt-1 text-sm text-zinc-300">{r.description}</div> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

