import { Link } from "@tanstack/react-router";
import { Card } from "@/components/site/primitives";
import { publisher, type Resource } from "@/data/resources";

function slugifyHeading(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Shared renderer for a published resource body. One component so an article's
 * text lives in one place and cannot drift between resource sections.
 */
export function ResourceArticle({ resource }: { resource: Resource }) {
  const sections = resource.sections ?? [];
  const showToc = sections.length > 3;

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {resource.category ? <span className="font-medium text-primary">{resource.category}</span> : null}
        {resource.published ? (
          <span>
            Published <time dateTime={resource.published}>{resource.published}</time>
          </span>
        ) : null}
        {resource.modified && resource.modified !== resource.published ? (
          <span>
            Updated <time dateTime={resource.modified}>{resource.modified}</time>
          </span>
        ) : null}
        {resource.readingTime ? <span>{resource.readingTime}</span> : null}
        <span>Published by {publisher}</span>
      </div>

      {showToc ? (
        <nav aria-label="On this page" className="mt-6 rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-semibold">On this page</p>
          <ul className="mt-2 space-y-1 text-sm">
            {sections.map((section) => (
              <li key={section.heading}>
                <a href={`#${slugifyHeading(section.heading)}`} className="text-primary hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="mt-6 space-y-8">
        {sections.map((section) => (
          <section key={section.heading} id={slugifyHeading(section.heading)}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((para, i) => (
                <p key={i} className="text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
            {section.points?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {resource.relatedFrameworks?.length || resource.relatedFeatures?.length ? (
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-semibold">Related in NOVA</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {[...(resource.relatedFrameworks ?? []), ...(resource.relatedFeatures ?? [])].map((item) => (
              <li key={item.to}>
                <Link to={item.to as any} className="text-primary hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
