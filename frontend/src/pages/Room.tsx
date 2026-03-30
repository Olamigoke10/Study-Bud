import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

type Room = {
  id: number;
  name: string;
  description?: string | null;
};

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<Room>(`/room/${id}/`)
      .then(setRoom)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      {error ? <div className="rounded bg-red-500/10 p-3 text-red-200">{error}</div> : null}

      {room ? (
        <>
          <h1 className="text-3xl font-bold">{room.name}</h1>
          {room.description ? <p className="mt-2 text-zinc-300">{room.description}</p> : null}

          <div className="mt-8 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="text-sm text-zinc-400">Messages UI will be wired in the next steps.</div>
          </div>
        </>
      ) : (
        !error && <div className="text-zinc-400">Loading room...</div>
      )}
    </div>
  );
}

