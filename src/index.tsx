import { configureSyncEngine } from "@tonk/keepsync";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import {
  registerServiceWorker,
  unregisterServiceWorker,
} from "./serviceWorkerRegistration";

// Service worker logic based on environment
if (process.env.NODE_ENV === "production") {
  // Only register service worker in production mode
  registerServiceWorker();
} else {
  // In development, make sure to unregister any existing service workers
  unregisterServiceWorker();
}

// Connect to the Tonk built-in sync server
const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
// Always use localhost:4080 for sync in development mode
const wsHost = process.env.NODE_ENV === "production" 
  ? window.location.host 
  : "localhost:4080";
const wsPath = "/";
const wsUrl = `${wsProtocol}//${wsHost}${wsPath}`;

console.log("Connecting to sync server at:", wsUrl);

configureSyncEngine({
  url: wsUrl,
  onSync: (docId) => console.log(`Document ${docId} synced`),
  onError: (error) => console.error("Sync error:", error),
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
