import { ArrowRight } from "lucide-react";

const layers = [
  { title: "Frameworks", items: ["SOC 2", "ISO 27001", "Essential Eight", "ISO 42001"] },
  { title: "Controls", items: ["Mapped expectations", "Owners", "Test cadence"] },
  { title: "Evidence", items: ["Uploads", "Connectors", "Reviewer validation"] },
  { title: "Assurance", items: ["Readiness reporting", "Trust Centre", "Auditor Portal"] },
];

export function PlatformFlow() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
        {layers.map((layer, i) => (
          <div key={layer.title} className="flex flex-1 items-center gap-3 md:flex-col md:items-start">
            <div className="flex-1 rounded-xl bg-surface p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">{layer.title}</h3>
              <ul className="mt-2 space-y-1">
                {layer.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {i < layers.length - 1 ? (
              <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground md:rotate-90" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
