export type Testimonial = {
  slug: string;
  quote: string;
  author: string;
  role: string;
  context: string;
};

/**
 * Kept empty until genuine, attributable customer feedback is approved for
 * public use. Illustrative scenarios belong on the customer page instead.
 */
export const testimonials: Testimonial[] = [];
