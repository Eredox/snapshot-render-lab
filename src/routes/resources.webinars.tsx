import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/webinars")({
  component: () => <Outlet />,
});
