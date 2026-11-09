// TEST-ONLY mock of the OpenAI-compatible chat API (DeepSeek). Never part of the production image.
import http from "node:http";
let n = 0;
http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      if (req.url && req.url.startsWith("/v1beta/interactions")) {
        const rate = 24000, secs = 3, samples = rate * secs, pcm = Buffer.alloc(samples * 2);
        for (let i = 0; i < samples; i++) pcm.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 220 * i) / rate) * 3000), i * 2);
        const h = Buffer.alloc(44); h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ steps: [{ type: "model_output", content: [{ type: "audio", data: Buffer.concat([h, pcm]).toString("base64") }] }] }));
        return;
      }
      n += 1;
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ choices: [{ message: { content: `Mock answer ${n}. This is a test response from a local mock, not a real AI service.` } }] }));
    });
  })
  .listen(Number(process.argv[2] || 18433), "127.0.0.1");
