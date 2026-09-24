/**
 * Published customer-facing legal document.
 *
 * Source: nova-compliance-os/frontend/src/content/legal/global/terms.ts
 * LEGAL-001F / v1.1-draft source promoted to final customer copy by founder approval.
 * Publication transformation removes review-state metadata and internal provenance
 * presentation while preserving the approved section sequence and operative wording.
 */
import type { PublishedLegalDocument } from "./legal-publication-types";
export const publishedTerms: PublishedLegalDocument = {
  metadata: {
    document_key: "global-master-saas-terms",
    title: "NOVA Global Master SaaS Terms and Conditions",
    short_title: "Terms and Conditions",
    document_type: "terms_and_conditions",
    jurisdiction: "global",
    language: "en",
    version: "1.1",
    status: "published_current",
    effective_date: "2026-09-24",
    updated_date: "2026-09-24",
    published_at: "2026-09-24",
    supersedes_version: "1.0",
    external_review_status: "completed",
    publication_status: "published",
    public_visibility: true,
    requires_acceptance: true,
    requires_reacceptance: true,
    acceptance_scope: "contractual_acceptance",
    applicable_customer_types: ["trial", "self_service", "enterprise_order_form"],
    applicable_regions: ["global"],
  },
  sections: [
    {
      title: "1. Document status, version and effective date",
      body: "This is the NOVA Global Master SaaS Terms and Conditions, version 1.1, effective 24 September 2026, and last updated 24 September 2026. It is effective and available for acceptance. This document governs use of the NOVA platform operated by Eredox Pty Ltd, together with any applicable Order Form, country or regional addendum, Data Processing Addendum, Service Level Agreement, Acceptable Use Policy, and Security and Shared Responsibility Schedule, per the order of precedence in Section 90.",
    },
    {
      title: "2. Important notice",
      body: "NOVA is software that helps organisations organise, monitor, document and manage aspects of compliance and assurance work. It is not a law firm, regulator, auditor, certification body, accounting firm, or insurer, and it does not replace professional legal, regulatory, accounting, audit or security advice. Using NOVA does not guarantee any legal, regulatory or audit outcome. Section 31 sets this out in full and should be read carefully before relying on NOVA for any compliance decision.",
    },
    {
      title: "3. Parties and agreement formation",
      body: 'These Terms are an agreement between Eredox Pty Ltd (ABN 32 634 165 941), a company registered in Queensland, Australia ("Eredox", "we", "us"), and the customer organisation that registers for or is provisioned with a NOVA account, or that is named on an applicable Order Form ("Customer", "you"). Where an individual accepts these Terms on behalf of an organisation, that individual confirms they have authority to bind that organisation, and "Customer" refers to that organisation.',
    },
    {
      title: "4. Definitions and interpretation",
      body: '"Services" means the NOVA platform and related support made available to Customer. "Customer Data" means data, content and files that Customer or its Authorised Users submit to or generate within the Services. "Authorised User" means an individual Customer permits to access the Services under Customer\'s account. "Order Form" means a signed or otherwise agreed ordering document referencing these Terms. "Applicable Law" means law that applies to a party or transaction under these Terms. "Applicable Privacy Law" means privacy, data protection, electronic communications, cybersecurity, and similar law that applies to the relevant processing or communication. "AI Processing" means machine-learning, natural-language, predictive, or pattern-analysis functionality used by NOVA to assist Customer with compliance workflows, classification, drafting, summarisation, or recommendations. "Subprocessor" means a third-party service provider Eredox engages to process Customer Data on Eredox\'s behalf in providing the Services. Headings are for convenience only and do not affect interpretation. Where these Terms conflict with a country or regional addendum for a Customer\'s jurisdiction, Section 90 (order of precedence) governs.',
    },
    {
      title: "5. Business-use intention and mandatory consumer rights",
      body: "NOVA is intended, designed and priced as a business-use SaaS platform for organisations, not as a consumer product. Nothing in these Terms limits or excludes any right, guarantee, or protection that applies as a matter of law to a party that legally qualifies as a consumer (or an equivalent legally protected category) in its jurisdiction, regardless of how these Terms describe the intended use of the Services. Sections 71 and 92 address this further.",
    },
    {
      title: "6. Eligibility, age and authority",
      body: "Customer must have the legal capacity and authority to enter into these Terms, and must ensure that each Authorised User is legally permitted to use the Services in their jurisdiction. Eredox has not adopted a specific minimum-age policy for Authorised Users as of the effective date; where Applicable Law sets a minimum age for entering into a contract of this kind, Customer is responsible for ensuring its Authorised Users meet it.",
    },
    {
      title: "7. Account registration",
      body: "Customer must provide accurate registration information and keep it current. Eredox may verify registration information and may decline or suspend registration where information appears false, incomplete, or where registration would breach these Terms, an Order Form, or Applicable Law.",
    },
    {
      title: "8. Customer administrators and authorised users",
      body: "Customer designates one or more account administrators responsible for managing Authorised Users, roles and permissions within the Services. Customer is responsible for all activity under its account, for ensuring Authorised Users comply with these Terms and any incorporated policy, and for promptly removing access for individuals no longer authorised to use the Services.",
    },
    {
      title: "9. Electronic acceptance and acceptance evidence",
      body: "Customer may accept these Terms only through an explicit authenticated human acceptance action presented by NOVA, or by executing or electronically accepting an Order Form that references these Terms. Passive continued use of the Services does not, by itself, constitute acceptance of these Terms. Where NOVA records electronic acceptance, the server resolves the authoritative document version and content hash, records the acceptance time, and attributes the event to the authenticated human user and tenant. Customer cannot supply the authoritative hash. Draft or unpublished documents cannot be accepted, and service accounts, AI systems, ATOS integrations, MCP hosts, and other automated agents cannot accept on behalf of a person.",
    },
    {
      title: "10. Order Forms and order of precedence",
      body: "An Order Form may set out Customer-specific commercial terms (such as plan, price, term, and payment terms) that supplement these Terms. Section 90 sets out the order of precedence between a signed Order Form, applicable addenda, the Data Processing Addendum, the Service Level Agreement, these Terms, the Acceptable Use Policy, the Security and Shared Responsibility Schedule, and the Cookie Policy.",
    },
    {
      title: "11. Free trials and evaluation access",
      body: "The standard NOVA self-service trial is 30 days from activation. Eredox may offer a different trial duration for a specific customer or channel, in which case the applicable trial duration, restrictions and features are displayed at signup or in an applicable Order Form before activation, and that displayed duration applies instead of the 30-day standard. Eredox may end a trial early where use is abusive, unlawful, or breaches these Terms. Customer will not be automatically charged at trial end unless Customer has been clearly presented with the applicable recurring price, billing interval and renewal mechanics and has taken an affirmative action to authorise recurring billing (such as completing checkout with a payment method) before any charge occurs. On trial expiry or termination, the tenant package enters the action and disposition process described in Sections 65-68; expiry of the trial does not automatically delete Customer Data.",
    },
    {
      title: "12. Subscription plans",
      body: "Eredox offers subscription plans that differ in price, user limits, feature availability and support. The plan applicable to Customer is the plan selected at signup, on an Order Form, or as subsequently changed per these Terms. Plan features and limits are as displayed in the Services and may be updated by Eredox from time to time; Section 59 addresses service modifications.",
    },
    {
      title: "13. Subscription term and automatic renewal",
      body: "A paid subscription renews automatically for successive terms of the same length as the then-current term (monthly or annual, as applicable), at the then-current price for the plan, unless Customer cancels before the renewal date per Section 19, or unless an Order Form states otherwise. The renewal date and billing interval are visible in the Services.",
    },
    {
      title: "14. Fees and recurring billing",
      body: "Customer must pay the fees applicable to its selected plan or Order Form. Fees are billed in advance on a recurring basis matching the billing interval, using the payment method Customer provides. Eredox will present the recurring price, billing interval and renewal mechanics clearly before Customer authorises a paid subscription, consistent with the disclosure-and-consent principles reflected in Section 82.",
    },
    {
      title: "15. Taxes",
      body: "Fees are exclusive of applicable transaction taxes, levies, duties, withholding taxes, or similar governmental charges unless stated otherwise. Eredox may collect taxes it is legally required to collect, and Customer must provide valid exemption documentation where Customer claims an exemption. Eredox remains responsible for taxes based on its own net income, payroll, and property. Statutory tax treatment takes priority over this Section. Withholding, gross-up, or tax allocation beyond this Section applies only where an Order Form expressly states it or Applicable Law requires an approved treatment.",
    },
    {
      title: "16. Payment authorisation",
      body: "By providing a payment method, Customer authorises Eredox and its payment processor to charge that payment method for all fees due, including recurring renewal charges, until the subscription is cancelled per Section 19. Payments for paid subscriptions are processed by a third-party payment processor (Stripe); Eredox does not itself store full payment card details.",
    },
    {
      title: "17. Failed and late payments",
      body: "If a payment fails or is overdue, Eredox may retry the charge, suspend access per Section 60 after reasonable notice where practicable, and/or charge interest or a late fee to the extent permitted by Applicable Law. Suspension for payment default does not waive amounts owing.",
    },
    {
      title: "18. Price changes",
      body: "Eredox may change plan pricing prospectively. Where a price change affects Customer's then-current plan, Eredox will give notice before the change takes effect on Customer's next renewal, and Customer may cancel before the changed price applies per Section 19. Eredox will not apply a price increase retroactively to a period already paid for.",
    },
    {
      title: "19. Cancellations",
      body: "Customer may cancel a subscription at any time via the Services or by contacting Eredox using the details published in the NOVA Legal Centre. Cancellation stops future renewals and takes effect at the end of the current paid term unless Applicable Law requires an earlier effect or a refund. Cancellation does not, by itself, entitle Customer to a refund for the remainder of the current paid term except as required by Applicable Law or expressly stated in an Order Form.",
    },
    {
      title: "20. Refunds and mandatory rights",
      body: "Except as required by Applicable Law or expressly stated in an Order Form, fees are non-refundable. Nothing in this Section limits a mandatory statutory refund, remedy, or cooling-off right that applies to Customer in its jurisdiction; Sections 71 and 92 preserve those rights expressly.",
    },
    {
      title: "21. Licence to use NOVA",
      body: "Subject to these Terms and payment of applicable fees, Eredox grants Customer a non-exclusive, non-transferable, revocable licence for Customer and its Authorised Users to access and use the Services during the subscription term, solely for Customer's internal business purposes. Customer must use NOVA APIs in accordance with Eredox's published API limits, authentication requirements, and security guidelines. Eredox may apply reasonable rate limiting, throttling, or temporary API-access controls to protect platform stability, enforce authentication, or prevent abuse.",
    },
    {
      title: "22. Account and user limits",
      body: "Use of the Services is subject to the user, framework, control, and connector limits (and other limits) applicable to Customer's plan, as displayed in the Services or an Order Form. Eredox may enforce these limits technically and may require a plan change where Customer exceeds them.",
    },
    {
      title: "23. Customer Data ownership",
      body: "As between the parties, Customer retains all right, title and interest in and to Customer Data. These Terms do not transfer ownership of Customer Data to Eredox.",
    },
    {
      title: "24. Customer licence to Eredox",
      body: "Customer grants Eredox a limited licence to host, copy, transmit, process, secure, back up, display and otherwise handle Customer Data solely to provide, protect, support and improve the Services, and to meet Eredox's legal obligations. This licence ends when Customer Data is deleted per Sections 65-67, except to the extent retained as permitted by those Sections.",
    },
    {
      title: "25. Customer Data warranties",
      body: "Customer warrants that it has the necessary rights, authority and lawful basis to submit Customer Data to the Services and to grant the licence in Section 24, and that Customer Data and its use of the Services do not infringe a third party's rights or breach Applicable Law.",
    },
    {
      title: "26. Eredox intellectual property",
      body: "Eredox and its licensors retain all right, title and interest in and to the Services, including the underlying software, platform, templates, control mappings, methodologies, user interface, and documentation. No rights are granted to Customer except the licence in Section 21.",
    },
    {
      title: "27. Customer-specific outputs",
      body: "Reports, policy drafts, and other outputs generated within the Services specifically from Customer Data may be used by Customer for its own internal purposes. This does not transfer to Customer any underlying Eredox template, software, model, mapping or methodology used to generate that output, which remains Eredox's property per Section 26.",
    },
    {
      title: "28. Feedback",
      body: "If Customer or an Authorised User provides Eredox with feedback or suggestions about the Services, Eredox may use that feedback without restriction or obligation to Customer, and without attributing it to Customer.",
    },
    {
      title: "29. Third-party services and integrations",
      body: "The Services may connect to or integrate with third-party services that Customer configures, including evidence connectors and identity providers. Eredox is not responsible for third-party services Customer chooses to connect, and Customer is responsible for its own accounts, credentials and configuration with those third parties. Eredox may engage Subprocessors to support the Services and will maintain subprocessor transparency through the NOVA Legal Centre or a Subprocessor Schedule once published. Detailed subprocessor commitments and international-transfer safeguards belong in the future Data Processing Addendum, Subprocessor Schedule, and International Data Transfer Schedule. NOVA is a separate product from any other Eredox product or platform, including ATOS. Where Eredox operates a shared Eredox account or login system across its products, that shared authentication does not by itself grant access to, or merge authorisation between, NOVA and another Eredox product. A connection between NOVA and another Eredox product, or a third-party protocol integration (such as a Model Context Protocol connector), requires its own separate authorisation and is not implied by these Terms. As of the date of these Terms, no such connection is offered as a generally available product feature.",
    },
    {
      title: "30. AI-assisted features",
      body: "Some Services features use artificial intelligence to help draft policy text, summarise evidence, or answer questions about Customer's compliance data. AI output may be incorrect, incomplete, outdated or unsuitable, is not professional advice, and must be independently reviewed by a qualified person before being relied on or acted on. Where an AI feature uses Eredox's own self-hosted local AI infrastructure, Customer Data submitted to that feature is not sent to an external AI provider by that feature. Where Customer configures and explicitly enables an external AI connector (such as a third-party AI provider) using Customer's own credentials, Customer Data submitted to that feature is processed by that third-party provider, and Eredox does not itself hold or supply credentials for that external provider. Customer must not submit data to an AI feature that Customer is not authorised to disclose to that feature's provider. Training and any other third-party AI processing is further addressed in the AI Features Addendum and the Privacy Policy once published; Eredox does not represent that Customer Data is never used to train a model unless and until that is confirmed for the specific provider and feature in question.",
    },
    {
      title: "31. Compliance-management nature of NOVA",
      body: "NOVA is a software platform that assists Customer to organise, monitor, document and manage aspects of compliance and assurance work. NOVA is not a law firm, a regulator, an auditor, a certification body, an accounting firm, an insurer, a replacement for professional advice, or a guarantee of legal or regulatory compliance. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    },
    {
      title: "32. No legal, regulatory, accounting, audit or certification advice",
      body: "Nothing generated by or presented in the Services, including AI-assisted output, constitutes legal, regulatory, accounting, audit or certification advice. Customer must obtain its own professional advice for these matters.",
    },
    {
      title: "33. No guarantee of audit or certification outcome",
      body: "Use of the Services does not guarantee successful certification, a passing audit, or acceptance of Customer's readiness by an auditor, regulator or other customer. Readiness indicators, scores and reports reflect information available in NOVA at the time they are generated, not a formal attestation.",
    },
    {
      title: "34. No immunity from fines, claims or security incidents",
      body: "Use of the Services does not guarantee the adequacy of Customer's security program, prevent every security incident or loss, or provide immunity from fines, penalties, claims or enforcement action against Customer. NOVA does not guarantee that every control or mapping presented is complete, or that a framework it references remains unchanged, or that Customer-provided evidence is accurate.",
    },
    {
      title: "35. Framework and regulatory changes",
      body: "Compliance frameworks and Applicable Law change over time. Customer is responsible for monitoring changes relevant to its own obligations; Eredox may update framework content in the Services from time to time but does not guarantee that such content is current for Customer's specific circumstances at any given time.",
    },
    {
      title: "36. Customer compliance responsibilities",
      body: "Customer remains responsible for determining the law and frameworks applicable to it, obtaining its own legal, regulatory, accounting, audit and security advice, defining the scope of its use of the Services, configuring the Services, assigning roles, controlling access, implementing controls outside the Services, meeting its regulatory deadlines, making required notifications, and responding to its own auditors and regulators. Where Customer uses a Services feature to communicate with its own end users (including for marketing or telemarketing purposes), Customer is responsible for complying with electronic marketing, telemarketing and any other applicable communications law in doing so.",
    },
    {
      title: "37. Customer evidence and data accuracy",
      body: "Customer is responsible for ensuring that evidence and other Customer Data uploaded to the Services is accurate, current, and genuinely representative of Customer's practices. Eredox does not independently verify uploaded evidence.",
    },
    {
      title: "38. Human review and approval obligations",
      body: "Customer must ensure a qualified person reviews and approves AI-assisted or NOVA-suggested output, mappings, and policy drafts before they are relied on, published, or acted on. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    },
    {
      title: "39. Shared responsibility",
      body: "Provision of the Services is a shared responsibility between Eredox and Customer, as further set out in the Security and Shared Responsibility Schedule once published. Eredox is responsible for the security of the platform it operates; Customer is responsible for its own accounts, access management, endpoints, and lawful use of the Services.",
    },
    {
      title: "40. Acceptable use",
      body: "Customer must use the Services only for lawful business purposes consistent with these Terms and the Acceptable Use Policy once published. If NOVA provides a feature that Customer uses to send email, SMS, or other electronic communications, Customer is responsible for ensuring those communications comply with applicable consent, opt-out, sender-identification, and recipient-jurisdiction requirements. Acceptable use requirements in this Section apply until a standalone Acceptable Use Policy is published, at which point Section 90's order of precedence applies.",
    },
    {
      title: "41. Prohibited conduct",
      body: "Customer must not use the Services to store or process information it is not authorised to hold, to violate a third party's rights, to violate Applicable Law, to scrape, harvest, or extract data in a manner inconsistent with intended platform functionality, or to attempt to circumvent rate limits, authentication, security, or access controls.",
    },
    {
      title: "42. Reverse engineering restrictions subject to mandatory law",
      body: "Customer must not reverse engineer, decompile or disassemble the Services, except to the extent Applicable Law expressly permits this despite a contractual restriction, in which case this Section applies only to the extent consistent with that mandatory right.",
    },
    {
      title: "43. Scraping and unauthorised automation",
      body: "Customer must not use scraping, bots, or other automated means to access the Services beyond Eredox's supported APIs and integration points, or in a manner that degrades the Services for other customers.",
    },
    {
      title: "44. Malicious code and security interference",
      body: "Customer must not introduce malicious code into the Services, or interfere with or attempt to disrupt the Services' security, integrity, availability, rate limiting, authentication, or monitoring controls.",
    },
    {
      title: "45. Account security",
      body: "Customer is responsible for keeping its account credentials confidential and for notifying Eredox promptly if Customer suspects unauthorised access to its account.",
    },
    {
      title: "46. Identity and access management",
      body: "Customer is responsible for its own identity and access management practices, including which individuals it authorises as Authorised Users, what roles it assigns them, and promptly revoking access when no longer appropriate.",
    },
    {
      title: "47. Customer systems and devices",
      body: "Customer is responsible for the security of its own systems, devices, and networks used to access the Services, and for any third-party integration Customer configures.",
    },
    {
      title: "48. Confidentiality",
      body: "Each party must protect the other's confidential information disclosed in connection with these Terms with reasonable care, and use it only to perform its obligations or exercise its rights under these Terms, except where disclosure is required by law or a court or regulator of competent authority.",
    },
    {
      title: "49. Information security",
      body: "Eredox maintains administrative, physical, and technical safeguards designed to protect the security of the Services appropriate to the nature of the Services, including access controls, vulnerability-management practices, encryption where appropriate, and secure software-development practices. These safeguards are aligned with recognised security-management expectations without representing that Eredox has obtained a specific certification, attestation, encryption configuration, or audit result unless separately published. No online platform can be guaranteed immune from every possible security incident. Further detail is set out in the Security and Shared Responsibility Schedule once published.",
    },
    {
      title: "50. Security incidents",
      body: "Eredox will notify Customer of a security incident affecting Customer Data where Eredox is required to do so by Applicable Law or as set out in the Data Processing Addendum once published, including where relevant Applicable Privacy Law creates breach-notification obligations. Eredox will take reasonable steps to investigate and address a confirmed incident affecting the Services.",
    },
    {
      title: "51. Privacy and Data Processing Addendum",
      body: "Eredox's handling of personal information is described in the NOVA Privacy Policy. Where Eredox processes personal data on Customer's behalf as a processor, the Data Processing Addendum (once published) applies to that processing and prevails over these Terms for processing matters, per Section 90. Acknowledging the Privacy Policy is not, by itself, Customer's or an Authorised User's consent to every processing activity it describes; where Applicable Law requires a separate consent for a specific processing activity, that consent must be obtained separately, per Section 91.",
    },
    {
      title: "52. Cookies and similar technologies",
      body: "Use of cookies and similar technologies on Eredox's public-facing properties is described in the Cookie Policy once published. Cookie consent is separate from acceptance of these Terms and from Privacy Policy acknowledgement, per Section 91.",
    },
    {
      title: "53. Service availability",
      body: "Eredox aims to make the Services available on a continuous basis, subject to scheduled and emergency maintenance, and factors outside Eredox's reasonable control (Section 80). Eredox does not guarantee uninterrupted availability except to the extent expressly committed in a Service Level Agreement applicable to Customer's plan.",
    },
    {
      title: "54. Service Level Agreement",
      body: "Where a Service Level Agreement applies to Customer's plan or Order Form, it sets out any availability commitment and associated remedy, and prevails over these Terms for availability matters per Section 90. No such commitment applies to a free trial.",
    },
    {
      title: "55. Scheduled maintenance",
      body: "Eredox may perform scheduled maintenance that temporarily affects Services availability, and will use reasonable efforts to provide advance notice where practicable.",
    },
    {
      title: "56. Emergency maintenance",
      body: "Eredox may perform emergency maintenance without advance notice where reasonably necessary to address a security threat, stability issue, or similar urgent matter.",
    },
    {
      title: "57. Support",
      body: "Eredox provides support for the Services using the channels published in the Services and the NOVA Legal Centre. Eredox will use reasonable efforts to support accessibility and continuing usability improvements, but these Terms do not state that NOVA conforms to a particular accessibility standard unless that commitment is separately audited and published. Specific support hours or response-time commitments, if any, are as stated in an applicable Order Form or Service Level Agreement; none is asserted by these Terms beyond what is separately published.",
    },
    {
      title: "58. Beta, preview and experimental features",
      body: "Eredox may make beta, preview or experimental features available on an as-is basis, without the commitments that apply to generally available Services features, and may modify or discontinue them at any time. Where an experimental feature uses AI Processing, Customer must not rely on the output without human review and professional judgement appropriate to Customer's regulatory environment.",
    },
    {
      title: "59. Service modifications",
      body: "Eredox may modify, add to, or discontinue a feature of the Services from time to time. Eredox will use reasonable efforts to avoid materially reducing the core functionality of a paid plan without reasonable notice.",
    },
    {
      title: "60. Suspension",
      body: "Eredox may suspend Customer's or an Authorised User's access immediately where reasonably necessary to address an active security threat, suspected fraud, unlawful conduct, serious harm to the Services or other customers, or where required for legal compliance including sanctions, export controls, telecommunications, or privacy obligations. For ordinary payment default or another remediable breach, Eredox will provide reasonable notice and an opportunity to remedy before suspending, where practicable.",
    },
    {
      title: "61. Term",
      body: "These Terms apply from Customer's acceptance until the subscription ends per Section 19, 62 or 63, or these Terms are otherwise terminated.",
    },
    {
      title: "62. Termination by the customer",
      body: "Customer may terminate for convenience by cancelling per Section 19, or immediately for Eredox's uncured material breach of these Terms after written notice and a reasonable opportunity to cure.",
    },
    {
      title: "63. Termination by Eredox",
      body: "Eredox may terminate or decline to renew Customer's subscription for Customer's uncured material breach after written notice and a reasonable opportunity to cure, for non-payment, for repeated breaches, on trial expiry per Section 11, or where required by Applicable Law. Eredox may also terminate where Customer becomes insolvent, to the extent Applicable Law permits termination on that basis.",
    },
    {
      title: "64. Effect of termination",
      body: "On termination, Customer's right to access the Services ends, except as needed to complete the data export and disposition process in Section 65. Accrued payment obligations survive termination. Sections that by their nature should survive termination (including Sections 23-28, 48, 65-68, 74-79, and 90-99) survive.",
    },
    {
      title: "65. Data export",
      body: "Following trial expiry, subscription expiry, or termination, Eredox will provide a standard 30-day action period unless an Order Form, Applicable Law, security restriction, legal hold, dispute, or approved extension requires different handling. Eredox intends to issue notices at expiry or termination, 14 days remaining, 7 days remaining, 1 day remaining, and when the 30-day action period expires. During the action period, an authorised Customer administrator may reactivate or renew, request an export, request deletion, request an extension, or notify Eredox of a dispute or exceptional circumstance. Export uses capability then available in the product; Eredox does not promise an export format or capability the product does not have at the relevant time. Where Eredox restricts access immediately under Section 60 for security or legal reasons, Eredox will provide an export mechanism where reasonably possible in the circumstances.",
    },
    {
      title: "66. Data return and deletion",
      body: "Expiry of the 30-day action period does not automatically delete Customer Data. The account enters administrative disposition review. That review is a non-content review: Eredox does not open, read, inspect, analyse, assess, classify, validate, or selectively review Customer Data. Customer Data is treated as a sealed tenant package. The review is limited to account status, trial or subscription status, notices issued, deadline expiry, export requests, renewal requests, extension requests, support or billing disputes, legal or regulatory holds, security restrictions, and approval requirements. Deletion requires an explicit decision by an authorised Eredox person. Where deletion is approved, the tenant data is removed from active systems as a package, without selective content inspection, and notices, decisions, approvals, and execution evidence are retained.",
    },
    {
      title: "67. Backup retention",
      body: "Customer Data may persist temporarily in backup copies after package deletion from active systems, until those backups reach their ordinary approved backup lifecycle expiry. Eredox does not promise immediate erasure of Customer Data from every backup copy.",
    },
    {
      title: "68. Legal holds",
      body: "Eredox may pause export, deletion, or disposition under Sections 65-67 where required to comply with a legal or regulatory hold, preserve records of fraud or security incidents, meet a financial record-keeping obligation, address a dispute, or comply with security restrictions, for as long as that requirement applies.",
    },
    {
      title: "69. Customer business-continuity responsibility",
      body: "Customer is responsible for maintaining its own business continuity arrangements, including exporting and separately retaining copies of Customer Data it needs to retain, independent of Eredox's own retention practices.",
    },
    {
      title: "70. Representations",
      body: "Each party represents that it has the authority to enter into these Terms and that doing so does not breach an obligation owed to a third party.",
    },
    {
      title: "71. Statutory and non-excludable rights",
      body: "Nothing in these Terms excludes, restricts or modifies a guarantee, right or remedy that Applicable Law does not permit to be excluded, restricted or modified, including consumer guarantees available to a party that legally qualifies as a consumer. Where these Terms purport to limit Eredox's liability or a remedy available to Customer, that limitation applies only to the maximum extent Applicable Law permits.",
    },
    {
      title: "72. Eredox warranties",
      body: "Eredox warrants that it will provide the Services with reasonable care and skill. Except as expressly stated in these Terms, an Order Form, or a Service Level Agreement, the Services are provided without other warranties.",
    },
    {
      title: "73. Disclaimers",
      body: 'To the maximum extent permitted by Applicable Law, and subject to Section 71, the Services are provided "as is" without warranty of any kind beyond those expressly stated in these Terms, an Order Form, or a Service Level Agreement. This disclaimer does not apply to the extent it would exclude a guarantee or remedy that cannot lawfully be excluded for Customer.',
    },
    {
      title: "74. Exclusion of indirect and consequential loss",
      body: "To the maximum extent permitted by Applicable Law, neither party is liable to the other for indirect, consequential, special or exemplary loss, or for lost profits, revenue, opportunity, goodwill, or anticipated savings arising out of or relating to these Terms, except that this Section does not limit a party's liability for its indemnity obligations under Sections 77-78, for a party's fraud or wilful misconduct, or for a liability that cannot lawfully be excluded.",
    },
    {
      title: "75. Liability cap",
      body: "To the maximum extent permitted by Applicable Law, and subject to Section 71, each party's aggregate liability arising out of or relating to the Services in respect of a paid subscription must not exceed the total fees paid or payable by Customer for the affected Services in the 12 months immediately preceding the event first giving rise to the claim. This cap does not apply to a party's indemnity obligations under Sections 77-78, to a party's fraud or wilful misconduct, or to a liability that cannot lawfully be capped.",
    },
    {
      title: "76. Liability allocation for free trials",
      body: "For a free trial or other free access to the Services, Eredox's aggregate liability arising out of or relating to that free access must not exceed AUD $1,000 (Australian dollars), to the maximum extent permitted by Applicable Law and subject to Section 71. This figure is Eredox's confirmed commercial position for external legal review and does not limit a guarantee, right or remedy that Applicable Law does not permit to be limited.",
    },
    {
      title: "77. Customer indemnities",
      body: "Customer must indemnify Eredox against third-party claims arising from: Customer Data that is unlawful or infringes a third party's rights; Customer's lack of authority or lawful basis to submit Customer Data; Customer's or an Authorised User's misuse of the Services; Customer's inaccurate regulatory representations; Customer's breach of the Acceptable Use Policy; and claims arising from systems or integrations Customer controls. This indemnity is subject to Section 78.",
    },
    {
      title: "78. Third-party claims procedure",
      body: "A party seeking indemnification must give the indemnifying party prompt notice of the claim, allow the indemnifying party to control its defence and settlement (provided any settlement does not impose liability on the indemnified party without its consent), and reasonably cooperate. The indemnifying party's obligation is reduced to the extent the claim was caused or made worse by the indemnified party's failure to give prompt notice or to mitigate.",
    },
    {
      title: "79. Insurance position",
      body: "Eredox does not make any representation about insurance coverage in these Terms.",
    },
    {
      title: "80. Force majeure",
      body: "Neither party is liable for a failure or delay in performance caused by circumstances beyond its reasonable control, including natural disaster, war, civil unrest, act of government, internet or utility failure, or a widespread outage of a third-party service the Services depend on, provided the affected party uses reasonable efforts to mitigate the impact.",
    },
    {
      title: "81. Export controls and sanctions",
      body: "Each party must comply with applicable trade control and economic sanctions law in connection with these Terms, and must not use the Services in violation of such law or permit access by a person or entity where doing so would breach sanctions or export-control law. Neither party will be treated as required to violate applicable sanctions law by reason of these Terms. These Terms do not state that NOVA performs automated sanctions screening.",
    },
    {
      title: "82. Anti-bribery and unlawful use",
      body: "Each party must comply with applicable anti-bribery and anti-corruption law in connection with these Terms, and must not use the Services for an unlawful purpose.",
    },
    {
      title: "83. Publicity and customer names",
      body: "Eredox will not name Customer or use Customer's logo in Eredox's own marketing without Customer's prior opt-in agreement, unless otherwise agreed in an Order Form.",
    },
    {
      title: "84. Assignment",
      body: "Neither party may assign these Terms without the other's consent, except that either party may assign these Terms in connection with a merger, acquisition, or sale of substantially all its relevant assets, on notice to the other party.",
    },
    {
      title: "85. Subcontractors",
      body: "Eredox may use subcontractors to help provide the Services, and remains responsible for a subcontractor's performance of the obligations Eredox delegates to it.",
    },
    {
      title: "86. No partnership or agency",
      body: "These Terms do not create a partnership, joint venture, or agency relationship between the parties. Neither party may bind the other.",
    },
    {
      title: "87. Notices",
      body: "Notices to Eredox must be sent using the legal contact details published in the NOVA Legal Centre. Notices to Customer may be sent to the contact details Customer has provided in the Services or an Order Form.",
    },
    {
      title: "88. Changes to the Terms",
      body: 'Eredox may update these Terms from time to time. Eredox will give advance notice of a material change before it takes effect, except where an immediate change is reasonably required to comply with Applicable Law or to address an urgent security matter. The current version, its version number, and "Updated — <date>" notation are shown on this page and sourced from the document\'s own metadata.',
    },
    {
      title: "89. Document versioning and reacceptance",
      body: "Each version of these Terms is separately identified by version number and effective date, with prior versions retained for reference. Where a new version materially changes Customer's or an Authorised User's obligations, Eredox may require reacceptance before further access to the Services, consistent with the version-history and reacceptance model described in the NOVA Global Legal Publication Architecture.",
    },
    {
      title: "90. Governing law",
      body: "These Terms are governed by the law of Queensland, Australia, without regard to conflict-of-law rules, except to the extent Applicable Law mandatorily provides otherwise for Customer's jurisdiction (Section 92) or a country or regional addendum expressly overrides this Section for that jurisdiction.",
    },
    {
      title: "91. Dispute resolution",
      body: "The parties will first attempt to resolve a dispute through escalation between each party's senior representatives, followed by good-faith negotiation. The parties may agree to mediation before commencing litigation. Subject to Section 92, the parties submit to the non-exclusive jurisdiction of the courts of Queensland, Australia.",
    },
    {
      title: "92. Mandatory local law",
      body: "Where Applicable Law in Customer's or an Authorised User's jurisdiction mandatorily grants a right, protection, governing-law outcome, or dispute-resolution forum that these Terms cannot lawfully override, that mandatory position prevails over the conflicting part of these Terms, and the rest of these Terms continues to apply.",
    },
    {
      title: "93. Regional addenda",
      body: "Eredox may publish a country or regional addendum for a specific jurisdiction (for example, Australia, the European Union/EEA, the United Kingdom, the United States and its states, Canada, New Zealand, Singapore, Japan, South Korea, India, Brazil, South Africa, or the United Arab Emirates) to reflect mandatory local law or local commercial practice. A published addendum applicable to Customer's jurisdiction prevails over these Terms to the extent of any conflict, per Section 90's order of precedence. Regional addenda must use proper versioning and notice and must not silently amend active customer agreements outside the applicable document-change process. As of the effective date, no country or regional addendum has been published.",
    },
    {
      title: "94. Severability",
      body: "If a provision of these Terms is held unenforceable, the rest of these Terms remains in effect, and the unenforceable provision is read down to the minimum extent needed to make it enforceable, or if that is not possible, severed.",
    },
    {
      title: "95. Waiver",
      body: "A failure or delay by either party to exercise a right under these Terms is not a waiver of that right.",
    },
    {
      title: "96. Entire agreement",
      body: "These Terms, together with any applicable Order Form, addendum, Data Processing Addendum, Service Level Agreement, Acceptable Use Policy, and Security and Shared Responsibility Schedule, are the entire agreement between the parties regarding the Services and supersede prior discussions on that subject, except a fraudulent misrepresentation.",
    },
    {
      title: "97. No reliance",
      body: "Each party confirms it has not entered into these Terms in reliance on a statement not set out in these Terms or the documents listed in Section 96, except a fraudulent misrepresentation.",
    },
    {
      title: "98. Interpretation and priority",
      body: "Section 90 governs the order of precedence between the documents forming the agreement. Within these Terms, a specific provision prevails over a general one to the extent of a direct conflict.",
    },
    {
      title: "99. Contact details",
      body: "Notices to Eredox, and questions about these Terms, must be sent using the legal contact details published in the NOVA Legal Centre. General product support is available at support@eredox.com.",
    },
    {
      title: "100. Country or regional addendum notice",
      body: "If Eredox publishes a country or regional addendum applicable to Customer's jurisdiction, it will be made available alongside these Terms via the NOVA Legal Centre, and Section 90 and Section 93 govern how it interacts with these Terms. Customer acknowledges that privacy, AI, electronic communications, security, sanctions, and related laws evolve over time, and Eredox may update regional addenda or compliance notices through the document-change process where needed to reflect Applicable Law. No such addendum exists as of the effective date.",
    },
    {
      title: "101. Electronic marketing communications",
      body: "Accepting these Terms is contractual acceptance only and does not, by itself, constitute consent to receive marketing communications; marketing consent, Privacy Policy acknowledgement, and required account, security, billing and legal communications are each treated separately, per Section 51. Eredox may send Customer or an Authorised User essential, non-marketing service communications (such as account, security, billing and legal notices) where legally permitted, without that being treated as marketing. Eredox will send marketing communications only where a lawful basis for doing so exists, such as an applicable consent or another basis recognised under Applicable Law. A recipient may withdraw marketing consent at any time using the unsubscribe facility provided in the relevant communication; withdrawing marketing consent does not stop essential service communications described above. Eredox may maintain a suppression record of a withdrawal so a recipient who has unsubscribed is not contacted again for marketing purposes. Where Customer uses a NOVA feature to send electronic messages to its own end users, Customer is responsible for complying with the electronic marketing and telemarketing law applicable to those messages, including obtaining any consent that law requires.",
    },
  ],
};

/**
 * Published customer-facing legal document.
 *
 * Source: nova-compliance-os/frontend/src/content/legal/global/privacy.ts
 * LEGAL-001F / v1.1-draft source promoted to final customer copy by founder approval.
 * Publication transformation removes review-state metadata and internal provenance
 * presentation while preserving the approved section sequence and operative wording.
 */
export const publishedPrivacy: PublishedLegalDocument = {
  metadata: {
    document_key: "global-privacy-policy",
    title: "NOVA Global Privacy Policy",
    short_title: "Privacy Policy",
    document_type: "privacy_policy",
    jurisdiction: "global",
    language: "en",
    version: "1.1",
    status: "published_current",
    effective_date: "2026-09-24",
    updated_date: "2026-09-24",
    published_at: "2026-09-24",
    supersedes_version: "1.0",
    external_review_status: "completed",
    publication_status: "published",
    public_visibility: true,
    requires_acceptance: true,
    requires_reacceptance: true,
    acceptance_scope: "privacy_notice_acknowledgement",
    applicable_customer_types: [
      "visitor",
      "trial",
      "self_service",
      "enterprise_order_form",
      "auditor",
      "external_user",
    ],
    applicable_regions: ["global"],
  },
  sections: [
    // 1-10: About this Policy, who Eredox is, scope, roles, definitions
    {
      title: "1. Document status, version and effective date",
      body: "This is the NOVA Global Privacy Policy, version 1.1, effective 24 September 2026, and last updated 24 September 2026. It is effective and available for acknowledgement. It explains how Eredox Pty Ltd handles personal information in connection with the NOVA platform and related websites.",
    },
    {
      title: "2. About this Policy",
      body: "This Policy explains what personal information Eredox collects or processes, why, on what legal basis where relevant, who it may be disclosed to, how long it is generally kept, and what rights an individual has. It works alongside the NOVA Global Master SaaS Terms and Conditions and, once published, the Data Processing Addendum, Cookie Policy, and AI Features Addendum.",
    },
    {
      title: "3. Who Eredox is",
      body: 'Eredox Pty Ltd (ABN 32 634 165 941) is a company registered in Queensland, Australia, and operates the NOVA platform. References to "Eredox," "we," or "us" in this Policy mean Eredox Pty Ltd.',
    },
    {
      title: "4. Scope",
      body: "This Policy applies to personal information Eredox processes in its own capacity — for example, in operating its website, administering accounts, billing, and providing support. It does not itself govern how a Customer processes personal information within Customer Data it controls; that is addressed in Sections 7-9 and, in more detail, the Data Processing Addendum once published.",
    },
    {
      title: "5. Services covered",
      body: "This Policy covers the NOVA platform (the Services described in the Terms), Eredox's public website, and Eredox's direct communications with visitors, trial applicants, and customers.",
    },
    {
      title: "6. Persons covered",
      body: "This Policy is relevant to website visitors, trial applicants, customer administrators, Authorised Users, invited auditors and external reviewers, support contacts, prospective customers, paid subscribers, integration users, and any individual whose personal information a Customer submits to NOVA as Customer Data.",
    },
    {
      title: "7. Customer-controlled data",
      body: "Where a Customer uploads or generates content in NOVA that includes personal information about its own employees, contractors, customers, suppliers, or auditors, that Customer generally determines the purpose of that processing and Eredox processes it on the Customer's behalf. See Section 9 and the NOVA Privacy Role Allocation Matrix for detail.",
    },
    {
      title: "8. Eredox-controlled data",
      body: "Where Eredox determines the purpose of processing in its own right — account administration, billing, security, service operations, support, legal compliance, website-visitor handling, Eredox's own marketing, acceptance records, and privacy-request handling — Eredox acts independently, not as a processor for a Customer.",
    },
    {
      title: "9. Controller and processor roles",
      body: "Depending on the processing in question, Eredox may act as an independent controller or equivalent responsible organisation (Section 8), or as a processor, service provider, or operator for a Customer acting as controller, business, or responsible party (Section 7). The applicable role depends on the actual processing and applicable law, not on a single blanket label — Eredox is not always solely a processor, and a Customer is not always solely responsible where Eredox independently determines a purpose. Full detail is in the NOVA Privacy Role Allocation Matrix. Where Eredox acts as a processor, the Data Processing Addendum (once published) will govern that processing and prevails over this Policy for processor obligations.",
    },
    {
      title: "10. Definitions",
      body: '"Personal information" (or "personal data") means information about an identified or reasonably identifiable individual. "Processing" means any operation performed on personal information. "Customer Data" has the meaning given in the Terms. Other capitalised terms have the meaning given in the Terms unless defined differently here.',
    },

    // 11-22: Information provided directly
    {
      title: "11. Information provided directly",
      body: "Eredox collects information an individual or a Customer provides directly — for example, when registering an account, completing a trial signup, contacting support, or configuring the Services.",
    },
    {
      title: "12. Account information",
      body: "Name, email address, and role, collected when an account is created (verified: `User.email`, `User.full_name`, `User.role`). Eredox does not currently implement multi-factor authentication, so no MFA data is collected.",
    },
    {
      title: "13. Organisation and tenant information",
      body: "The organisation (tenant) name and related administrative details a Customer provides when its NOVA workspace is provisioned.",
    },
    {
      title: "14. Trial and subscription information",
      body: "Trial start/end dates, plan selection, and subscription status (verified: `Subscription.is_trial`, `Subscription.trial_ends_at`, `Subscription.plan`).",
    },
    {
      title: "15. Billing and transaction information",
      body: "Billing contact details and a payment-provider identifier are recorded by Eredox (verified: `Subscription.external_id`, confirmed to be the Stripe customer/subscription identifier). Card and other payment details are collected and processed directly by Stripe, Eredox's payment processor — Eredox does not itself store full card numbers.",
    },
    {
      title: "16. Authentication and security information",
      body: "Hashed passwords (never plain-text), session tokens, API key metadata (name, prefix, hash, last-used date), and password-reset request records including the requesting IP address (verified: `User.hashed_password`, `ApiKey`, `PasswordResetToken.requested_ip`).",
    },
    {
      title: "17. Compliance and evidence information",
      body: "Controls, policies, evidence, risks, assets, and reports a Customer creates or uploads within NOVA. This is Customer Data — see Section 7.",
    },
    {
      title: "18. Files and uploaded content",
      body: "Documents and other files a Customer or its Authorised Users upload as evidence or supporting material, which may include personal information about the Customer's own personnel or third parties if the Customer chooses to include it.",
    },
    {
      title: "19. Support and communications",
      body: "Content of support requests sent to support@eredox.com. NOVA does not currently use a dedicated in-app ticketing or help-desk platform — support is handled by direct email today.",
    },
    {
      title: "20. Feedback and surveys",
      body: "If an individual chooses to give feedback or complete a survey, Eredox collects what is submitted. Participation is voluntary.",
    },
    {
      title: "21. Information from integrations",
      body: "Where a Customer configures an evidence connector or other integration, data flows in according to how the Customer has configured that connection. This is Customer-controlled — see Section 7.",
    },
    {
      title: "22. Information from administrators and other users",
      body: "A Customer's administrator may provide information about other individuals when creating their Authorised User accounts (e.g. name and email) or when configuring roles and permissions.",
    },

    // 23-35: Automatically collected
    {
      title: "23. Information collected automatically",
      body: "Some information is generated automatically through use of the Services, described in Sections 24-30.",
    },
    {
      title: "24. Device and browser data",
      body: "Where captured, browser/user-agent information is recorded for specific security purposes — see Section 26. NOVA does not operate a general device-fingerprinting or analytics-tracking system.",
    },
    {
      title: "25. IP addresses",
      body: "IP addresses are recorded in the server-side audit log for security purposes (verified: `AuditLog.ip_address`) and in password-reset request records (verified: `PasswordResetToken.requested_ip`). Eredox does not derive geolocation from IP addresses — no such capability exists in the product.",
    },
    {
      title: "26. Logs and audit records",
      body: "NOVA maintains a server-side audit log recording actions, the acting user, timestamps, and related detail (verified: `AuditLog` model). This is the authoritative record of platform activity — not any client-side storage (see Section 27).",
    },
    {
      title: "27. Cookies and local storage",
      body: "NOVA uses strictly necessary first-party session cookies for authenticated browser access. The HttpOnly `nova_session` cookie contains only an opaque server-side session reference; a separate `nova_csrf` cookie supports request-forgery protection. NOVA does not persist access or refresh tokens in browser storage. Full detail is in the NOVA Cookie and Storage Technology Inventory. These cookies are not NOVA's audit trail — the authoritative record is the server-side audit log (Section 26).",
    },
    {
      title: "28. Analytics and performance data",
      body: "NOVA does not currently integrate a third-party analytics or performance-monitoring service. No such data is collected today.",
    },
    {
      title: "29. Security monitoring",
      body: "Eredox monitors the Services for security purposes using the audit log and related internal tooling described in Section 26 and the Terms' security provisions.",
    },
    {
      title: "30. Marketing and preference data",
      body: "NOVA does not currently operate a newsletter subscription, marketing-preference centre, or email/SMS marketing-consent capture mechanism — this is a greenfield area, not yet built. If and when Eredox introduces optional marketing communications, this Section and Sections 122-128 will describe the specific mechanism, and marketing consent will always be captured separately from Terms acceptance and Privacy Policy acknowledgement.",
    },
    {
      title: "31. Legal acceptance and acknowledgement records",
      body: "NOVA has a backend foundation for recording Terms acceptance evidence and Privacy Policy acknowledgement evidence, including document version, server-authoritative document hash, user and tenant attribution, timestamp, and audit evidence. Terms acceptance and Privacy Policy acknowledgement are distinct from consent to a separate processing activity, and any applicable acceptance or acknowledgement record is governed by the version and publication status of the document presented at the time.",
    },
    {
      title: "32. Consent and withdrawal records",
      body: "Where Eredox relies on consent for a specific processing activity (for example, future optional marketing, or a tenant's own enablement of an external AI connector), Eredox intends to keep a record of that consent and any withdrawal. Acknowledging this Policy is not, by itself, consent to any processing activity that legally requires separate consent — see Section 54.",
    },
    {
      title: "33. AI prompts, inputs and outputs",
      body: "Where a Customer or Authorised User uses an AI-assisted feature, the prompt/context submitted and NOVA's generated output are processed as described in Section 61 and the NOVA AI Privacy Processing Register. Submitted content may include personal information if the user includes it — Eredox does not filter this before processing.",
    },
    {
      title: "34. Sensitive or special-category information",
      body: "NOVA does not ask for sensitive or special-category information (such as health data, biometric data, or precise geolocation) as part of its own account or billing processes. If a Customer chooses to include such information within Customer Data it uploads, that is the Customer's own processing decision (Section 7), and the Customer is responsible for ensuring it has an appropriate lawful basis to do so, consistent with the Terms.",
    },
    {
      title: "35. Children and age restrictions",
      body: "NOVA is a business-use platform not directed at children. Eredox does not intentionally solicit children's information for its own account administration, and Eredox has not implemented a specific age-verification mechanism in the product. Customer Data may include information selected by a Customer, and Customer is responsible for ensuring it has authority and a lawful basis for any information it uploads or asks NOVA to process.",
    },

    // 36-50: Purposes
    {
      title: "36. Purposes of processing",
      body: "Eredox processes personal information for the purposes described in Sections 37-49, each of which is recorded in more detail, with its legal basis, in the NOVA Privacy Purpose and Legal Basis Matrix.",
    },
    {
      title: "37. Service delivery",
      body: "To provide, operate, and maintain the Services a Customer has subscribed to.",
    },
    {
      title: "38. Contract administration",
      body: "To create and administer accounts, tenants, roles, and subscriptions.",
    },
    { title: "39. Billing", body: "To charge for paid plans and administer billing, via Stripe." },
    {
      title: "40. Security and fraud prevention",
      body: "To detect, investigate, and prevent unauthorised access, fraud, and abuse.",
    },
    { title: "41. Support", body: "To respond to support requests sent to Eredox." },
    {
      title: "42. Compliance and legal obligations",
      body: "To meet Eredox's own legal, tax, and accounting obligations.",
    },
    {
      title: "43. Service communications",
      body: "To notify users of matters affecting their use of the Services, including security and billing notices.",
    },
    {
      title: "44. Product improvement",
      body: "To improve the Services generally, using aggregated or de-identified information where genuinely de-identified, or otherwise only on an appropriate legal basis.",
    },
    {
      title: "45. Analytics",
      body: "Not currently applicable — no analytics processing occurs, per Section 28.",
    },
    {
      title: "46. AI-assisted functionality",
      body: "To provide AI-assisted features using the AI processing paths described in Section 61. Eredox does not use this Policy to claim unverified AI metadata categories, model-training datasets, behavioural profiles, inferred personal attributes, or AI decision scores.",
    },
    {
      title: "47. Marketing",
      body: "Only where Eredox introduces an optional marketing capability and only on the basis of separately captured consent or another lawful basis recognised under applicable law — not currently operative, per Section 30.",
    },
    {
      title: "48. Surveys and research",
      body: "To understand user feedback, where an individual chooses to participate.",
    },
    {
      title: "49. Legal claims",
      body: "To establish, exercise, or defend legal claims, and to cooperate with lawful requests from courts, regulators, or law enforcement.",
    },

    // 50-55: Lawful bases
    {
      title: "50. Lawful bases",
      body: "Where a jurisdiction's law requires a specific lawful basis for processing (for example, the EU/EEA and UK GDPR frameworks), Eredox relies on the bases described in Sections 51-54, applied to the specific purpose as set out in the NOVA Privacy Purpose and Legal Basis Matrix — never a single basis asserted as covering everything.",
    },
    {
      title: "51. Contract necessity",
      body: "Where processing is objectively necessary to provide the Services a Customer or individual has requested (for example, account creation, authentication, billing), Eredox relies on contractual necessity.",
    },
    {
      title: "52. Legal obligation",
      body: "Where Eredox must process personal information to comply with a legal obligation (for example, financial record-keeping, responding to a lawful regulator request), it relies on that obligation.",
    },
    {
      title: "53. Legitimate interests",
      body: "Where Eredox relies on legitimate interests (for example, security monitoring, fraud prevention, or service improvement using non-de-identified data), the specific interest is identified in the NOVA Privacy Purpose and Legal Basis Matrix, and Eredox's assessment weighs that interest against an individual's rights and reasonable expectations. Legitimate interests is not used as a universal, unexamined basis for every purpose.",
    },
    {
      title: "54. Consent",
      body: "Where Eredox relies on consent (for example, a future optional-marketing capability, or a tenant's enablement of an external AI connector), that consent can be withdrawn at any time, and withdrawal does not affect the lawfulness of processing carried out before withdrawal. Acknowledging this Policy is not itself consent to a processing activity that requires separate consent under applicable law.",
    },
    {
      title: "55. Customer instructions",
      body: "Where Eredox processes Customer Data as a processor, it does so on the Customer's documented instructions, as will be further specified in the Data Processing Addendum once published — not on an independent basis of its own for that content.",
    },

    // 56-65: Disclosure
    {
      title: "56. How information is disclosed",
      body: "Eredox discloses personal information only as described in Sections 57-65, and does not sell personal information — no sale or third-party-sharing-for-cross-context-behavioural-advertising practice was found or is described in this Policy.",
    },
    {
      title: "57. Customer administrators",
      body: "A Customer's own administrators can see information about that Customer's own Authorised Users, within the tenant they administer.",
    },
    {
      title: "58. Authorised users",
      body: "Other Authorised Users within the same tenant may see information as configured by the Customer's own role and permission settings.",
    },
    {
      title: "59. Service providers and subprocessors",
      body: "Eredox uses a limited number of service providers to operate the Services, listed in the NOVA Subprocessor Register. Current service providers and processing locations, where confirmed, are identified in that register; unconfirmed items are not asserted here as fact.",
    },
    {
      title: "60. Payment providers",
      body: "Stripe, Eredox's payment processor, receives payment-provider identifiers and processes payment details directly — see Section 15.",
    },
    {
      title: "61. AI providers",
      body: "NOVA's default AI features run on Eredox's own self-hosted local AI infrastructure; no content is sent to an external AI provider by that path. Where a Customer configures and explicitly enables its own connector to an external AI provider (for example, OpenAI, Anthropic, or DeepSeek), content submitted to that feature is processed by that provider under the terms the Customer itself has agreed to when configuring the connector — Eredox does not hold a platform-level credential for any external AI provider and is not a party to that processing relationship. Full detail is in the NOVA AI Privacy Processing Register. Eredox does not represent that any external provider trains models on submitted content, or that it does not — this has not been verified provider-by-provider and is not asserted either way.",
    },
    {
      title: "62. Infrastructure providers",
      body: "Eredox's own infrastructure (database, cache, object storage, search) is described in the NOVA Subprocessor Register; the specific hosting provider and location for a production deployment are not confirmed in this Policy — see the NOVA International Data Transfer Register.",
    },
    {
      title: "63. Professional advisers",
      body: "Eredox may disclose personal information to its own professional advisers (for example, lawyers, accountants, auditors) where reasonably necessary.",
    },
    {
      title: "64. Authorities and legal process",
      body: "Eredox may disclose personal information where required by law, court order, or lawful request from a regulator or law enforcement body.",
    },
    {
      title: "65. Corporate transactions",
      body: "If Eredox is involved in a merger, acquisition, or sale of assets, personal information may be disclosed as part of that transaction, subject to appropriate safeguards.",
    },

    // 66-70: Transfers, security
    {
      title: "66. International transfers",
      body: "Personal information may be processed in a country other than the one an individual is located in. Eredox has not independently confirmed the specific hosting location(s) used for a production deployment in this Policy — see the NOVA International Data Transfer Register. Where a transfer occurs to a country without an applicable adequacy decision, Eredox intends to rely on a recognised transfer mechanism such as the European Commission's Standard Contractual Clauses or the UK's equivalent transfer mechanism, consistent with the safeguards described in Section 67.",
    },
    {
      title: "67. Transfer safeguards",
      body: "Where a cross-border transfer requires a safeguard under applicable law (for example, the GDPR's Chapter V mechanisms), Eredox intends to use an adequacy decision where the destination is covered by one, or the current modernised Standard Contractual Clauses (including a transfer-impact assessment) or an equivalent UK mechanism otherwise. This is a statement of intended approach, not a representation that a specific mechanism is already executed for a specific transfer, since the underlying hosting-location facts are not yet confirmed.",
    },
    {
      title: "68. Data localisation",
      body: "Eredox has not confirmed offering a customer-selectable data-residency or localisation option in the product today, notwithstanding that its underlying infrastructure stack is technically self-hostable in a specific region. A Customer requiring a specific data-residency commitment should raise this directly with Eredox using the contact details in Section 133 rather than assume one exists.",
    },
    {
      title: "69. Security safeguards",
      body: "Eredox maintains administrative, physical, and technical safeguards designed to protect personal information appropriate to its nature, consistent with Section 49 of the Terms. These safeguards are risk-appropriate and do not state a specific certification, attestation, encryption configuration, or audit result unless separately published. Further detail will be in the Security and Shared Responsibility Schedule once published.",
    },
    {
      title: "70. No absolute-security guarantee",
      body: "No method of transmission or storage is completely secure. Eredox does not guarantee absolute security and cannot promise that a security incident will never occur.",
    },

    // 71-78: Retention
    {
      title: "71. Retention principles",
      body: "Eredox retains personal information for as long as needed for the purpose it was collected for, plus any period required by law, subject to the specific periods and gaps identified in the NOVA Personal Information Retention and Deletion Schedule. Eredox does not assert a single universal retention period across every category of information.",
    },
    {
      title: "72. Retention schedule",
      body: "The approved retention position is a 30-day post-expiry or post-termination action period before administrative disposition review, and a 30-day retention period for generated auditor evidence-package export artefacts. Other categories do not yet have a confirmed period and are not asserted as having one.",
    },
    {
      title: "73. Account closure",
      body: "When an account, trial, or subscription ends, personal information is handled per Sections 74-77 and the Terms' termination provisions (Sections 64-69). Expiry does not automatically delete Customer Data.",
    },
    {
      title: "74. Data export",
      body: "Following trial expiry, subscription expiry, or termination, Eredox intends to provide the 30-day action period described in Section 65 of the Terms, using then-available product export capability. Notices are intended at expiry or termination, 14 days remaining, 7 days remaining, 1 day remaining, and final expiry of the action period. Supported export formats depend on then-current product capability.",
    },
    {
      title: "75. Active-system deletion",
      body: "Expiry of the 30-day action period does not automatically delete Customer Data. The account enters administrative disposition review, which is expressly non-content review: Eredox does not open, read, inspect, analyse, assess, classify, validate, or selectively review Customer Data. Customer Data is treated as a sealed tenant package. Deletion requires an explicit decision by an authorised Eredox person. Where deletion is approved, the tenant package is removed from active systems as a package, without selective content inspection, and notices, decisions, approvals, and execution evidence are retained.",
    },
    {
      title: "76. Backup expiry",
      body: "Personal information may persist temporarily in backup copies after package deletion from active systems, until those backups reach their ordinary approved backup lifecycle expiry. Eredox does not promise immediate erasure from every backup copy.",
    },
    {
      title: "77. Legal holds",
      body: "Eredox may pause export, deletion, or disposition, or retain personal information beyond its ordinary retention period, where required to comply with a legal or regulatory hold, preserve fraud or security records, meet a financial record-keeping obligation, address a dispute, or comply with security restrictions, for as long as that requirement applies.",
    },
    {
      title: "78. De-identification and aggregation",
      body: "Where Eredox uses aggregated or de-identified information (for example, for service improvement), it does so only where the applicable de-identification standard is genuinely met for the relevant purpose. Eredox does not describe merely pseudonymised information (information that could be re-identified using additional information Eredox or another party holds) as anonymous.",
    },

    // 79-97: Individual rights
    {
      title: "79. Individual rights",
      body: "Depending on applicable law, an individual may have some or all of the rights described in Sections 80-91. These rights, and how to exercise them, vary by jurisdiction — see Sections 98-111 for jurisdiction-specific detail and Sections 92-97 for how to exercise a right generally.",
    },
    {
      title: "80. Access",
      body: "The right to request confirmation of, and access to, personal information Eredox holds, where applicable law provides this right.",
    },
    {
      title: "81. Correction",
      body: "The right to request correction of inaccurate or incomplete personal information, where applicable law provides this right.",
    },
    {
      title: "82. Deletion",
      body: "The right to request deletion of personal information, subject to exceptions such as a legal obligation to retain it, where applicable law provides this right.",
    },
    {
      title: "83. Restriction",
      body: "The right to request that Eredox restrict processing in certain circumstances, where applicable law provides this right (for example, under the GDPR/UK GDPR framework).",
    },
    {
      title: "84. Objection",
      body: "The right to object to certain processing, including processing based on legitimate interests, where applicable law provides this right.",
    },
    {
      title: "85. Portability",
      body: "The right to receive certain personal information in a portable format, where applicable law provides this right.",
    },
    {
      title: "86. Consent withdrawal",
      body: "Where processing is based on consent, the right to withdraw that consent at any time, without affecting the lawfulness of processing carried out before withdrawal — see Section 54.",
    },
    {
      title: "87. Sale/sharing opt-out where applicable",
      body: "Eredox does not sell or share personal information for cross-context behavioural advertising as those terms are used in California's CCPA/CPRA framework, based on the processing described in this Policy. Where applicable law nonetheless provides an opt-out right, an individual may exercise it using the contact details in Section 133.",
    },
    {
      title: "88. Targeted-advertising opt-out where applicable",
      body: "NOVA does not currently engage in targeted advertising — see Section 30. Where applicable law provides an opt-out right regardless, an individual may exercise it using the contact details in Section 133.",
    },
    {
      title: "89. Sensitive-information rights",
      body: "Where applicable law grants additional rights over sensitive personal information, and to the extent NOVA processes any (see Section 34), those additional rights apply.",
    },
    {
      title: "90. Automated-decision rights",
      body: "NOVA's compliance-readiness indicators and AI-assisted features are decision-support tools for human users, not automated decisions producing legal or similarly significant effects on individuals, based on the processing described in this Policy. Where applicable law provides rights concerning automated decision-making (for example, Australia's amended transparency provisions, not yet in force as of the effective date — see the source register), those rights apply to the extent NOVA's processing falls within their scope.",
    },
    {
      title: "91. Non-discrimination",
      body: "Eredox will not discriminate against an individual for exercising a privacy right, where applicable law prohibits this (for example, under CCPA/CPRA).",
    },
    {
      title: "92. Authorised agents",
      body: "Where applicable law permits, an individual may use an authorised agent to exercise a right on their behalf, subject to Eredox verifying the agent's authority.",
    },
    {
      title: "93. Exercising rights",
      body: "A request to exercise a privacy right can be made using the contact details in Section 133. See the NOVA Privacy Rights Request and Complaint Workflow for how Eredox intends to handle such a request.",
    },
    {
      title: "94. Identity verification",
      body: "Eredox may need to verify a requester's identity before acting on a request, proportionate to the sensitivity of the request.",
    },
    {
      title: "95. Response timing",
      body: "Response periods and applicable rights depend on the law that applies to the individual making the request — this Policy does not state a single universal response deadline. Where a specific deadline is legally required (for example, under a jurisdiction's data-protection law), Eredox intends to meet it.",
    },
    {
      title: "96. Appeal rights",
      body: "Where applicable law provides a right to appeal Eredox's response to a request, an individual may do so using the contact details in Section 133.",
    },
    {
      title: "97. Complaints",
      body: "An individual may also complain to Eredox directly (Section 134) or to their applicable data-protection regulator (Section 135).",
    },

    // 98-111: Regional rights
    {
      title: "98. Australian rights",
      body: "Individuals in Australia have rights under the Privacy Act 1988 (Cth) and its Australian Privacy Principles, including access and correction (APP 12, APP 13), and may complain to Eredox or to the Office of the Australian Information Commissioner (OAIC).",
    },
    {
      title: "99. EU/EEA rights",
      body: "Individuals in the EU/EEA have rights under the GDPR, including access, rectification, erasure, restriction, objection, and portability (Articles 15-22), and may complain to their competent supervisory authority.",
    },
    {
      title: "100. United Kingdom rights",
      body: "Individuals in the UK have equivalent rights under the UK GDPR and the Data Protection Act 2018, as amended by the Data (Use and Access) Act 2025 (in force in full as of the effective date), and may complain to the Information Commissioner's Office (ICO).",
    },
    {
      title: "101. United States state rights",
      body: "Individuals in certain US states (for example, California, under the CCPA as amended by the CPRA and current CPPA regulations) have rights including access, deletion, correction, and opt-out of sale/sharing where applicable. Rights and their exact scope vary by state; not every US state provides the same rights, and this Policy does not claim a single nationwide US privacy law applies uniformly.",
    },
    {
      title: "102. Canadian rights",
      body: "Individuals in Canada have rights under PIPEDA (access, correction, and complaint to the Office of the Privacy Commissioner of Canada) and, where applicable, stricter provincial law such as Quebec's Law 25.",
    },
    {
      title: "103. New Zealand rights",
      body: "Individuals in New Zealand have rights under the Privacy Act 2020, including access and correction, and — since 1 May 2026 — the benefit of IPP 3A's notification requirement for indirectly-collected personal information, and may complain to the Privacy Commissioner.",
    },
    {
      title: "104. Singapore rights",
      body: "Individuals in Singapore have rights under the Personal Data Protection Act 2012, including access and correction, and may complain to the Personal Data Protection Commission (PDPC).",
    },
    {
      title: "105. Japanese rights",
      body: "Individuals in Japan have rights under the Act on the Protection of Personal Information, and may raise concerns with the Personal Information Protection Commission (PPC).",
    },
    {
      title: "106. South Korean rights",
      body: "Individuals in South Korea have rights under the Personal Information Protection Act, and may raise concerns with the Personal Information Protection Commission (PIPC).",
    },
    {
      title: "107. Indian rights",
      body: "India's Digital Personal Data Protection Act 2023 and its 2025 Rules are in a phased commencement — as of the effective date, the Act's core data-fiduciary obligations and data-principal rights machinery are not yet fully in force (they phase in through 14 May 2027, per the NOVA Authoritative Legal Source Register). Individuals in India will have rights under that Act as its provisions come into force.",
    },
    {
      title: "108. Brazilian rights",
      body: "Individuals in Brazil have rights under the Lei Geral de Proteção de Dados (LGPD), including confirmation, access, correction, and objection, and may raise concerns with the Autoridade Nacional de Proteção de Dados (ANPD).",
    },
    {
      title: "109. South African rights",
      body: "Individuals in South Africa have rights under the Protection of Personal Information Act (POPIA), and may raise concerns with the Information Regulator.",
    },
    {
      title: "110. UAE and regional financial-centre rights",
      body: "Individuals in the UAE have rights under Federal Decree-Law No. 45 of 2021, or, where applicable, the separate DIFC or ADGM data protection regimes, which operate independently of the federal law.",
    },
    {
      title: "111. Rest-of-World rights",
      body: "Where an individual is located in a jurisdiction not specifically addressed above, Eredox will honour any mandatory local privacy law that applies, consistent with the mandatory-local-law approach in the Terms. Eredox has not researched every jurisdiction's specific privacy law in detail — this Section is a savings clause, not a representation of jurisdiction-by-jurisdiction compliance.",
    },

    // 112-114: Incidents
    {
      title: "112. Privacy incidents and data breaches",
      body: 'Eredox intends to assess a suspected security incident to determine whether personal information was involved and whether it meets a legal notification threshold. Not every incident is a notifiable data breach — see the NOVA Privacy Incident Notification Matrix. No universal notification-timing rule (such as a single global "72 hours") is used in this Policy.',
    },
    {
      title: "113. Regulatory notifications",
      body: "Where an incident meets a jurisdiction's legal notification threshold, Eredox intends to notify the applicable regulator consistent with that jurisdiction's requirement (for example, Australia's Notifiable Data Breaches scheme, which requires a reasonable and expeditious assessment within a maximum of 30 days).",
    },
    {
      title: "114. Customer breach cooperation",
      body: "Where an incident affects Customer Data for which Eredox acts as a processor, Eredox intends to notify the affected Customer so the Customer can meet its own obligations. Eredox has not approved a specific fixed contractual notification-timing commitment as of the effective date — see the NOVA Privacy Incident Notification Matrix.",
    },

    // 115-121: Cookies
    {
      title: "115. Cookies and similar technologies",
      body: "NOVA uses strictly necessary first-party session cookies for authenticated browser access. Section 27 and the NOVA Cookie and Storage Technology Inventory describe their purpose and expiry. NOVA does not use analytics or marketing cookies.",
    },
    {
      title: "116. Strictly necessary technologies",
      body: "The HttpOnly `nova_session` cookie and the readable `nova_csrf` double-submit cookie are strictly necessary to keep a user signed in securely and protect state-changing requests. They do not contain access or refresh tokens.",
    },
    { title: "117. Functional technologies", body: "None currently implemented." },
    { title: "118. Analytics technologies", body: "None currently implemented — see Section 28." },
    { title: "119. Marketing technologies", body: "None currently implemented — see Section 30." },
    {
      title: "120. Cookie preferences",
      body: "These cookies are strictly necessary for the requested authenticated service. No analytics or marketing cookie preference is required because those technologies are not currently used.",
    },
    {
      title: "121. Global Privacy Control",
      body: "NOVA does not currently detect or respond to the Global Privacy Control signal, consistent with there being no sale/sharing of personal information or targeted advertising to opt out of today (Sections 87-88). This will be revisited if that changes.",
    },

    // 122-128: Electronic marketing / ACMA
    {
      title: "122. Electronic marketing",
      body: "Eredox does not currently send marketing communications — no newsletter, marketing-consent capture, or outbound marketing-send capability exists in the product today (Section 30). This Section describes the principles that will apply if and when that changes. Accepting the Terms or acknowledging this Policy does not, by itself, constitute consent to receive marketing communications.",
    },
    {
      title: "123. Essential service communications",
      body: "Eredox may send essential, non-marketing communications (account, security, billing, and legal notices) where legally permitted, and these are not treated as marketing regardless of a recipient's marketing preferences.",
    },
    {
      title: "124. Email marketing",
      body: "If introduced, email marketing will be sent only where a lawful basis (such as consent) exists, with accurate sender identification and a functional unsubscribe facility, consistent with the Spam Act 2003 (Cth) principles described in the NOVA Authoritative Legal Source Register and the NOVA ACMA Electronic Communications Operational Implementation Register.",
    },
    {
      title: "125. SMS marketing",
      body: "NOVA does not currently use SMS for any purpose, including marketing. If an alphanumeric SMS sender ID is adopted in future, it will be registered on the ACMA SMS Sender ID Register (in force since 1 July 2026, before this Policy's date) through a participating telecommunications provider before use, per the ACMA operational register.",
    },
    {
      title: "126. Telemarketing",
      body: "Eredox does not currently telemarket. If it does in future, it will screen against the Do Not Call Register and observe the Telecommunications (Telemarketing and Research Calls) Industry Standard 2017's permitted-hours and identification requirements.",
    },
    {
      title: "127. Unsubscribe and suppression",
      body: "Any future marketing communication will include a functional unsubscribe mechanism. Withdrawing marketing consent does not stop essential service communications (Section 123). Eredox may keep a limited suppression record of a withdrawal to ensure a recipient who unsubscribed is not contacted again for marketing purposes.",
    },
    {
      title: "128. ACMA and Australian communications treatment",
      body: "Where Eredox sends commercial electronic messages from or into Australia, it intends to meet the Spam Act 2003 and Spam Regulations 2021 requirements for consent, accurate sender identification, and a working unsubscribe facility, as detailed in the NOVA Authoritative Legal Source Register §A and the NOVA ACMA Electronic Communications Operational Implementation Register. Not every message NOVA sends is treated as exempt merely because it also contains service content — a message combining promotional and essential content is assessed on its overall character.",
    },

    // 129-138: Links, changes, contact
    {
      title: "129. Third-party links and services",
      body: "NOVA or Eredox's website may link to third-party sites or services Eredox does not control. This Policy does not apply to those third parties' own privacy practices.",
    },
    {
      title: "130. Changes to this Policy",
      body: "Eredox may update this Policy from time to time. Material changes will be notified in advance where reasonably practicable, except where an immediate change is required for legal or urgent security reasons.",
    },
    {
      title: "131. Version history",
      body: "Each version of this Policy is separately identified by version number and effective date, consistent with the LEGAL-001A publication architecture's versioning model.",
    },
    {
      title: "132. Material changes and notice",
      body: "Where a new version materially changes how personal information is handled, Eredox may seek fresh acknowledgement, consistent with the reacceptance model described in the NOVA Global Legal Publication Architecture.",
    },
    {
      title: "133. Contacting Eredox",
      body: "Questions about this Policy, and requests to exercise a privacy right, must be sent using the legal contact details published in the NOVA Legal Centre. General product support is available at support@eredox.com.",
    },
    {
      title: "134. Privacy complaints",
      body: "An individual may raise a privacy complaint directly with Eredox using the contact details in Section 133. See the NOVA Privacy Rights Request and Complaint Workflow for how Eredox intends to handle a complaint.",
    },
    {
      title: "135. Regulator contacts",
      body: "An individual may also complain to their applicable data-protection regulator — for example, the OAIC in Australia, the ICO in the UK, a competent supervisory authority in the EU/EEA, or the equivalent regulator identified for their jurisdiction in Sections 98-111.",
    },
    {
      title: "136. Regional notices and addenda",
      body: "Eredox may publish a country or regional privacy addendum to reflect mandatory local law. As of the effective date, no such addendum has been published — see Section 111.",
    },
    {
      title: "137. Language and interpretation",
      body: "This Policy is published in English. Where a translation is provided, the English version prevails in the event of a conflict, unless applicable law requires otherwise.",
    },
    {
      title: "138. Effective-date and update notation",
      body: "This Policy's current version, effective date, and \"Updated — <date>\" notation are shown on this page and sourced from the document's own metadata, not a hardcoded page-level date.",
    },
  ],
};

export const publishedLegalDocuments = [publishedTerms, publishedPrivacy] as const;
