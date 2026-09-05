export type Testimonial = {
  slug: string;
  quote: string;
  author: string;
  role: string;
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    slug: "security-lead-reduce-deal-friction",
    quote:
      "We stopped treating every security review as a one-off. Having our controls, evidence and scope decisions in one place cut the time to respond to a questionnaire by more than half.",
    author: "Security lead",
    role: "Technology SME",
    context: "Multi-framework readiness programme",
  },
  {
    slug: "compliance-manager-single-source",
    quote:
      "The biggest change was that our team no longer argues about which version of a control is current. Evidence points at requirements, and when something changes the lineage is visible.",
    author: "Compliance manager",
    role: "Regulated services organisation",
    context: "ISO/IEC 27001 and SOC 2 preparation",
  },
  {
    slug: "founder-first-certification",
    quote:
      "As a founder, I needed to know what we actually had to do for SOC 2 and what was optional. NOVA made the scope feel manageable instead of overwhelming.",
    author: "Founder",
    role: "B2B SaaS startup",
    context: "First-time SOC 2 readiness",
  },
  {
    slug: "auditor-scoped-access",
    quote:
      "The reviewer portal gave us exactly what we needed and nothing more. Scoped access meant we could review evidence without being dropped into someone else's file storage.",
    author: "External auditor",
    role: "Assurance firm",
    context: "Client evidence review",
  },
];
