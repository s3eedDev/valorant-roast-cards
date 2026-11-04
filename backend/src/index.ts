import express from "express";

const app = express();
const PORT = 3000;

// A route: when a client sends GET /health, run this function.
// req = the incoming request, res = what we send back.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Start listening for requests on the port.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});