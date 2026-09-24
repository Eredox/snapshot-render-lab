export type PublishedLegalSection = {
  title: string;
  body: string;
};

export type PublishedLegalDocument = {
  metadata: {
    document_key: string;
    title: string;
    short_title: string;
    document_type: "terms_and_conditions" | "privacy_policy";
    jurisdiction: "global";
    language: string;
    version: string;
    status: "published_current";
    effective_date: string;
    updated_date: string;
    published_at: string;
    supersedes_version: string | null;
    external_review_status?: "completed";
    publication_status: "published";
    public_visibility: boolean;
    requires_acceptance: boolean;
    requires_reacceptance: boolean;
    acceptance_scope: "contractual_acceptance" | "privacy_notice_acknowledgement";
    applicable_customer_types: string[];
    applicable_regions: string[];
  };
  sections: PublishedLegalSection[];
};
