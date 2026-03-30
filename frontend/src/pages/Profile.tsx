import { useParams } from "react-router-dom";

export default function Profile() {
  const { pk } = useParams<{ pk: string }>();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-2 text-zinc-300">User id: {pk}</p>

      <div className="mt-6 rounded border border-zinc-800 bg-zinc-900/50 p-4">
        Profile details will be wired in the API expansion step.
      </div>
    </div>
  );
}

