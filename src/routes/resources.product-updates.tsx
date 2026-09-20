import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/product-updates")({
  component: () => <Outlet />,
});
