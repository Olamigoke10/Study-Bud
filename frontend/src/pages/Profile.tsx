import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

type User = {
  id: number;
  username: string;
};

type Room = {
  id: number;
  name: string;
  description?: string | null;
  topic?: { id: number; name: string };
};

type Message = {
  id: number;
  user: User;
  body: string;
  created: string;
  updated: string;
};

type Profile = {
  id: number;
  username: string;
  rooms: Room[];
  messages: Message[];
};

export default function Profile() {
  const { pk } = useParams<{ pk: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pk) return;
    apiFetch<Profile>(`/profile/${pk}/`)
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [pk]);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      {error ? <div className="mt-2 rounded bg-red-500/10 p-3 text-red-200">{error}</div> : null}

      {profile ? (
        <>
          <p className="mt-2 text-zinc-300">Username: {profile.username}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Rooms</h2>
            <div className="mt-3 space-y-2">
              {profile.rooms.length ? (
                profile.rooms.map((r) => (
                  <Link
                    key={r.id}
                    to={`/room/${r.id}`}
                    className="block rounded border border-zinc-800 bg-zinc-900/40 p-3 hover:bg-zinc-800/30"
                  >
                    <div className="font-semibold">{r.name}</div>
                    {r.topic ? <div className="text-sm text-zinc-400">{r.topic.name}</div> : null}
                  </Link>
                ))
              ) : (
                <div className="text-sm text-zinc-400">No rooms yet.</div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Recent Messages</h2>
            <div className="mt-3 space-y-3">
              {profile.messages.slice(0, 8).map((m) => (
                <div key={m.id} className="rounded bg-zinc-900/40 p-3 border border-zinc-800">
                  <div className="text-sm text-zinc-400">{m.created}</div>
                  <div className="mt-1 text-sm whitespace-pre-wrap">{m.body}</div>
                </div>
              ))}
              {!profile.messages.length ? (
                <div className="text-sm text-zinc-400">No messages yet.</div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        !error && <div className="mt-2 text-zinc-400">Loading...</div>
      )}

    </div>
  );
}

