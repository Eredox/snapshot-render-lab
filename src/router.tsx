import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/** Per-request CSP nonce set by src/server.ts (server render only; undefined in the browser). */
function requestNonce(): string | undefined {
  return (globalThis as { __novaNonceStore?: { getStore(): string | undefined } }).__novaNonceStore?.getStore();
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ...(requestNonce() ? { ssr: { nonce: requestNonce() as string } } : {}),
  });

  return router;
};
