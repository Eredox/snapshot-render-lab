#!/usr/bin/env node
/**
 * Lab-only reverse proxy that gzip-compresses text responses like the production nginx edge does, so
 * local transfer-size and timing measurements are comparable with the live site.
 *
 *   node scripts/lab-gzip-proxy.mjs 3300 http://127.0.0.1:3204
 */
import http from "node:http";
import zlib from "node:zlib";

const [listenPort, target] = [Number(process.argv[2] || 3300), new URL(process.argv[3] || "http://127.0.0.1:3000")];
const compressible = /^(text\/|application\/(javascript|json|xml)|image\/svg)/;

http
  .createServer((req, res) => {
    const upstream = http.request(
      { host: target.hostname, port: target.port, path: req.url, method: req.method, headers: { ...req.headers, host: target.host, "accept-encoding": "identity" } },
      (up) => {
        const type = String(up.headers["content-type"] || "");
        const headers = { ...up.headers };
        if (compressible.test(type) && /\bgzip\b/.test(String(req.headers["accept-encoding"] || ""))) {
          delete headers["content-length"];
          headers["content-encoding"] = "gzip";
          headers["vary"] = "Accept-Encoding";
          res.writeHead(up.statusCode || 200, headers);
          up.pipe(zlib.createGzip({ level: 6 })).pipe(res);
        } else {
          res.writeHead(up.statusCode || 200, headers);
          up.pipe(res);
        }
      },
    );
    upstream.on("error", () => { res.statusCode = 502; res.end(); });
    req.pipe(upstream);
  })
  .listen(listenPort, "127.0.0.1", () => console.log(`gzip lab proxy on ${listenPort} -> ${target.origin}`));
