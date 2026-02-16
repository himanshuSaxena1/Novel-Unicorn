import next from "next";
import { createServer } from "http";
import { parse } from "url";
import { initSocket } from "./lib/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

async function startServer() {
  await app.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
});
