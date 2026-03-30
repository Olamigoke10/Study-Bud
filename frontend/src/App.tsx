import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/profile/:pk" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="*" element={<div className="p-6">Not found.</div>} />
      </Routes>
    </div>
  );
}

