// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "node-server",
    // Unhashed public files: cache for 30 days (hashed /assets/* already get a 1-year immutable header from Nitro).
    // routeRules is a valid Nitro option that the wrapper's narrow nitro type does not declare, hence the spread.
    ...({
      routeRules: {
        "/media/**": { headers: { "cache-control": "public, max-age=2592000" } },
        "/fonts/**": { headers: { "cache-control": "public, max-age=2592000" } },
        "/og/**": { headers: { "cache-control": "public, max-age=2592000" } },
        "/favicon.ico": { headers: { "cache-control": "public, max-age=86400" } },
      },
    } as Record<string, unknown>),
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
