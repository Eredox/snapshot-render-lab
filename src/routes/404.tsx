import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
  head: () => ({
    meta: [
      { title: "Page not found | NOVA Compliance" },
      { name: "description", content: "The requested page could not be found." },
    ],
    links: [{ rel: "canonical", href: "/404" }],
  }),
});

function NotFoundPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Return home
        </Link>
      </div>
    </main>
  );
}
