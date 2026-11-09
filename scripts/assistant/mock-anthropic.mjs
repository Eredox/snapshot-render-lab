// TEST-ONLY mock of the Anthropic Messages API. Never part of the production image.
import http from "node:http";
let n = 0;
http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      n += 1;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ content: [{ type: "text", text: `Mock answer ${n}. This is a test response from a local mock, not a real AI service.` }] }));
    });
  })
  .listen(Number(process.argv[2] || 18433), "127.0.0.1");
