import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

type User = { id: number; username: string };

type Message = {
  id: number;
  user: User;
  body: string;
  created: string;
  updated: string;
};

type RoomPreview = {
  id: number;
  name: string;
  topic?: { id: number; name: string };
};

type ActivityItem = {
  room: RoomPreview;
  latestMessage: Message | null;
};

export default function Activity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const rooms = await apiFetch<RoomPreview[]>("/rooms/");
        const topRooms = rooms.slice(0, 6);

        const details = await Promise.all(
          topRooms.map((r) => apiFetch<{ messages: Message[] }>(`/room/${r.id}/`))
        );

        if (cancelled) return;

        const next: ActivityItem[] = topRooms.map((r, idx) => ({
          room: r,
          latestMessage: details[idx].messages?.[0] ?? null,
        }));

        setItems(next);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Activity</h1>
      {error ? <div className="mt-3 rounded bg-red-500/10 p-3 text-red-200">{error}</div> : null}

      {items.length ? (
        <div className="mt-6 space-y-3">
          {items.map((it) => (
            <Link
              key={it.room.id}
              to={`/room/${it.room.id}`}
              className="block rounded border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-800/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{it.room.name}</div>
                  {it.room.topic ? (
                    <div className="text-sm text-zinc-400">{it.room.topic.name}</div>
                  ) : null}
                </div>
                {it.latestMessage ? (
                  <div className="text-xs text-zinc-500">{it.latestMessage.created}</div>
                ) : (
                  <div className="text-xs text-zinc-500">No messages</div>
                )}
              </div>

              {it.latestMessage ? (
                <div className="mt-2 line-clamp-2 text-sm text-zinc-200">{it.latestMessage.body}</div>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        !error && <div className="mt-6 text-zinc-400">Loading...</div>
      )}
    </div>
  );
}

