import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/case-studies")({
  component: () => <Outlet />,
});
