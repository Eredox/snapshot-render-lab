/**
 * Approved public NOVA knowledge for the Information Assistant: built only from the same public data modules that render
 * the marketing site (frameworks, features, plans, solutions, industries, FAQs, published articles). No customer, tenant or
 * credential data exists here. Server-only: the client never receives it.
 */
import { faqCategories, publishedResources } from "@/data/resources";
import { frameworks } from "@/data/frameworks";
import { features } from "@/data/features";
import { industries } from "@/data/industries";
import { currency, plans, pricingFaqs } from "@/data/pricing";
import { solutions } from "@/data/solutions";
import { site } from "@/config/site";
import { normalisePath } from "./assistant-topics";

type Doc = { id: string; path: string; title: string; text: string };

const join = (parts: (string | undefined | null | string[])[]) =>
  parts.flatMap((p) => (Array.isArray(p) ? p : p ? [p] : [])).join(" ");

let cache: Doc[] | undefined;

function docs(): Doc[] {
  if (cache) return cache;
  const out: Doc[] = [];
  for (const f of frameworks) {
    out.push({
      id: `framework:${f.slug}`,
      path: `/frameworks/${f.slug}`,
      title: f.name,
      text: join([
        `${f.name} (${f.category}; availability in NOVA: ${f.availability}).`,
        f.description,
        f.overview,
        `Intended for: ${f.intendedFor.join("; ")}.`,
        `Governance areas: ${f.governanceAreas.map((g) => `${g.title}: ${g.body}`).join(" ")}`,
        `How NOVA supports it: ${f.novaSupport.join("; ")}.`,
        `Typical controls and evidence: ${f.controlsAndEvidence.join("; ")}.`,
        `Cross-framework reuse: ${f.crossFramework.join("; ")}.`,
      ]),
    });
  }
  for (const f of features) {
    out.push({
      id: `feature:${f.slug}`,
      path: f.path,
      title: f.name,
      text: join([
        `${f.name} (${f.availability}).`,
        f.summary,
        f.problem,
        f.workflow.map((w) => `${w.title}: ${w.body}${w.points ? ` ${w.points.join("; ")}.` : ""}`),
        f.capabilities.map((c) => `${c.title}: ${c.body}`),
        `Human responsibilities: ${f.humanResponsibilities.join("; ")}.`,
      ]),
    });
  }
  for (const p of plans) {
    const price = p.quoteOnly || p.monthly == null ? "priced by quote" : `${currency} ${p.monthly}/month (${p.annual == null ? "annual n/a" : `${currency} ${p.annual}/year billed annually`})`;
    out.push({
      id: `plan:${p.slug}`,
      path: p.detailPath,
      title: `${p.name} plan`,
      text: join([
        `${p.name} plan: ${price}.`,
        p.summary,
        `Best for: ${p.bestFor}.`,
        `Includes: ${p.includes.join("; ")}.`,
        `Support: ${p.support}.`,
        `Frameworks: ${p.frameworkEntitlement}. GitHub repositories: ${p.githubRepositoryEntitlement}. Users: ${p.maxUsers ?? "custom"}. Controls: ${p.maxControls ?? "custom"}.`,
        site.pricingApprovalNote,
      ]),
    });
  }
  for (const s of solutions) {
    out.push({
      id: `solution:${s.slug}`,
      path: s.path,
      title: s.name,
      text: join([s.name, s.summary, s.intro, s.capabilities, s.governance, s.challenges.map((c) => `${c.title}: ${c.body}`)]),
    });
  }
  for (const i of industries) {
    out.push({
      id: `industry:${i.slug}`,
      path: `/industries/${i.slug}`,
      title: i.name,
      text: join([`${i.name}.`, i.summary, `Challenges: ${i.challenges.join("; ")}.`, `Relevant frameworks: ${i.frameworks.join(", ")}.`]),
    });
  }
  for (const q of pricingFaqs) out.push({ id: `pricing-faq:${q.question}`, path: "/pricing", title: q.question, text: `${q.question} ${q.answer}` });
  for (const c of faqCategories) {
    for (const q of c.items) out.push({ id: `faq:${q.question}`, path: "/resources/faq", title: q.question, text: `${q.question} ${q.answer}` });
  }
  for (const r of publishedResources) {
    out.push({
      id: `resource:${r.slug}`,
      path: `/resources/${r.type === "Guide" ? "guides" : "blog"}/${r.slug}`,
      title: r.title,
      text: join([r.title, r.summary, (r.sections ?? []).map((s) => `${s.heading}: ${s.paragraphs.join(" ")} ${(s.points ?? []).join("; ")}`)]),
    });
  }
  cache = out;
  return out;
}

const STOP = new Set("a an and are as at be by can do does for from how i in is it my of on or our so that the this to we what when which who will with you your nova".split(" "));
const tokens = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t));

export const CORE_FACTS = [
  `${site.productName} is developed and operated by ${site.company}. ${site.tagline}`,
  site.humanStatement,
  site.frameworkDisclaimer,
  site.pricingApprovalNote,
].join(" ");

/** Picks the most relevant public documents for the question and the page being viewed (bounded size). */
export function retrieveKnowledge(question: string, pagePath: string, maxChars = 12_000): { text: string; sources: string[] } {
  const path = normalisePath(pagePath);
  const q = new Set(tokens(question));
  const scored = docs()
    .map((d) => {
      const title = new Set(tokens(d.title));
      const body = new Set(tokens(d.text));
      let score = 0;
      for (const t of q) score += (title.has(t) ? 4 : 0) + (body.has(t) ? 1 : 0);
      if (d.path === path) score += 6; // the page being read is the strongest context
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  let used = 0;
  const picked: Doc[] = [];
  for (const { d } of scored) {
    const cost = Math.min(d.text.length, 3_000);
    if (picked.length >= 6 || used + cost > maxChars) continue;
    picked.push(d);
    used += cost;
  }
  return {
    text: picked.map((d) => `### ${d.title} (${d.path})\n${d.text.slice(0, 3_000)}`).join("\n\n"),
    sources: picked.map((d) => d.path),
  };
}
