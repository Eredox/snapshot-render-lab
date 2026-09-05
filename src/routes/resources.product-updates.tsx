import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading, Card } from "@/components/site/primitives";
import { resources } from "@/data/resources";

export const Route = createFileRoute("/resources/product-updates")({
  component: ProductUpdatesPage,
  head: () => ({
    meta: [
      { title: "Product updates | NOVA Compliance" },
      { name: "description", content: "Release notes and product updates for NOVA Compliance." },
      { property: "og:title", content: "Product updates | NOVA Compliance" },
      { property: "og:description", content: "Release notes and product updates for NOVA Compliance." },
    ],
    links: [{ rel: "canonical", href: "/resources/product-updates" }],
  }),
});

const items = resources.filter((r) => r.type === "Product update");

function ProductUpdatesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Product updates"
        description="Release notes and platform updates for NOVA Compliance."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Product updates", to: "/resources/product-updates" },
        ]}
      />
      <Section>
        <SectionHeading title="Updates" description="Notes are published once each release is approved for distribution." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <Card key={r.slug} interactive>
              <Link to={`/resources/product-updates/${r.slug}` as any} className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.type}</span>
                <h2 className="mt-2 text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
