import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/blog")({
  component: () => <Outlet />,
});
