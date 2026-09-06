import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/book-demo")({
  component: BookDemoLayout,
});

function BookDemoLayout() {
  return <Outlet />;
}
