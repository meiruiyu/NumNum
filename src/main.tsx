import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "leaflet/dist/leaflet.css";
import { bootstrapAuth } from "./app/lib/auth.ts";

// Apply persisted theme (or default) before React renders so the first
// paint already has the right colors.
bootstrapAuth();

createRoot(document.getElementById("root")!).render(<App />);
