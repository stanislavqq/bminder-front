import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Starting Birthday Management System (Frontend Only)...");

// Start Vite dev server
const viteProcess = spawn("npx", ["vite", "dev", "--host", "0.0.0.0", "--port", "5000"], {
  cwd: path.join(__dirname, "..", "client"),
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" }
});

// Handle Vite process errors
viteProcess.on("error", (error) => {
  console.error("Failed to start Vite dev server:", error);
  process.exit(1);
});

viteProcess.on("exit", (code) => {
  console.log(`Vite dev server exited with code ${code}`);
  process.exit(code || 0);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  viteProcess.kill("SIGTERM");
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  viteProcess.kill("SIGINT");
});

console.log("Frontend server will be available at http://localhost:5000");
