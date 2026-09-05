import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, PageHero } from "@/components/site/primitives";
import { CtaLink } from "@/components/site/cta";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [{ title: "Page not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
  }),
  component: NotFound,
});

function NotFound() {
  return (
    <>
      <PageHero
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        breadcrumbs={[{ label: "Not found", to: "/" }]}
      />

      <Section>
        <div className="flex flex-wrap gap-3">
          <CtaLink to="/">Back to home</CtaLink>
          <CtaLink to="/contact" variant="outline">
            Contact us
          </CtaLink>
        </div>
      </Section>
    </>
  );
}
