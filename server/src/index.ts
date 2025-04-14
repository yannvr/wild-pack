import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { createSyncServer } from "@tonk/server";

const app = express();
const PORT = process.env.PORT || 8080; // Changed to 8080 to match client config
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ 
  server,
  path: "/sync" // Match the path in client configuration
});

// Set up Tonk sync functionality
createSyncServer(wss);

// Basic route for hello world
app.get("/api/hello", (req, res) => {
  res.send("Hello World Api!");
});

app.get("/ping", (req, res) => {
  res.send("pong!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket sync server available at ws://localhost:${PORT}/sync`);
});
