import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/tailwind.css";

const el = document.getElementById("app");
if (!el) throw new Error("Missing #app element");

createRoot(el).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

