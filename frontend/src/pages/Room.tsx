import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

type User = {
  id: number;
  username: string;
};

type Message = {
  id: number;
  user: User;
  body: string;
  created: string;
  updated: string;
};

type RoomDetail = {
  id: number;
  name: string;
  description?: string | null;
  topic?: { id: number; name: string };
  host?: User;
  participants?: User[];
  messages?: Message[];
};

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    apiFetch<RoomDetail>(`/room/${id}/`)
      .then((r) => {
        // Ensure messages is always an array for rendering.
        setRoom({ ...r, messages: r.messages ?? [] });
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [id]);

  useEffect(() => {
    if (!threadEndRef.current) return;
    threadEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages]);

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!id) return;

    const body = messageBody.trim();
    if (!body) return;

    setSending(true);
    setError(null);

    try {
      const created = await apiFetch<Message>("/messages/", {
        method: "POST",
        body: { room: Number(id), body },
      });

      setRoom((prev) => {
        if (!prev) return prev;
        // API orders messages newest-first; prepend so our render (oldest -> newest) stays correct.
        const nextMessages = [created, ...(prev.messages ?? [])];
        return { ...prev, messages: nextMessages };
      });
      setMessageBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {error ? <div className="rounded bg-red-500/10 p-3 text-red-200">{error}</div> : null}

      {room ? (
        <>
          <h1 className="text-3xl font-bold">{room.name}</h1>
          {room.description ? <p className="mt-2 text-zinc-300">{room.description}</p> : null}
          {room.topic ? (
            <div className="mt-2 text-sm text-zinc-400">Topic: {room.topic.name}</div>
          ) : null}

          <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400">
            <div>
              Participants: <span className="text-zinc-200">{room.participants?.length ?? 0}</span>
            </div>
          </div>

          <div className="mt-8 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-4 text-sm text-zinc-400">Messages</div>

            <div className="max-h-[420px] overflow-auto pr-2">
              <div className="space-y-3">
                {[...(room.messages ?? [])].reverse().map((m) => (
                  <div key={m.id} className="rounded bg-zinc-800/40 p-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-sm font-semibold text-zinc-100">{m.user.username}</div>
                      <div className="text-xs text-zinc-500">{m.created}</div>
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{m.body}</div>
                  </div>
                ))}
              </div>

              <div ref={threadEndRef} />
            </div>

            <form onSubmit={onSend} className="mt-4 flex flex-col gap-2">
              <textarea
                className="min-h-[80px] w-full resize-y rounded border border-zinc-700 bg-zinc-950 p-2 text-sm text-zinc-100"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Write a message..."
              />
              <button
                disabled={sending}
                className="w-fit rounded bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-60"
                type="submit"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </>
      ) : (
        !error && <div className="text-zinc-400">Loading room...</div>
      )}
    </div>
  );
}

