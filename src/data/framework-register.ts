export type RegisterPriority = "Core" | "Sector" | "Reference";

export type RegisterEntry = {
  name: string;
  jurisdiction: string;
  subject: string;
  relevance: string;
  priority: RegisterPriority;
};

export type RegisterRegion = {
  id: string;
  label: string;
  shortLabel: string;
  intro: string;
  entries: RegisterEntry[];
};

export const registerNote =
  "This register is a product catalogue and discovery baseline, not a certification or legal opinion. Applicability depends on customer country, sector, data, service and contractual role.";

export const registerPriorityMeaning: { priority: RegisterPriority; meaning: string }[] = [
  { priority: "Core", meaning: "Cross-market or foundational. Prioritised in the catalogue, control library, crosswalks, evidence and reporting." },
  { priority: "Sector", meaning: "Triggered by sector or activity. Supported as an add-on with applicability assessment and sector evidence." },
  { priority: "Reference", meaning: "Voluntary or mapping aid. Used for crosswalks, procurement and assurance, never presented as certification." },
];

export const frameworkRegister: RegisterRegion[] = [
  {
    id: "global",
    label: "Global and cross border",
    shortLabel: "Global",
    intro: "Major frameworks and regimes encountered across every market. Confirm applicability for each customer engagement.",
    entries: [
      { name: "ISO/IEC 27001:2022", jurisdiction: "International", subject: "Information security management system requirements", relevance: "Core product framework for governance, controls, evidence, risk treatment and certification readiness.", priority: "Core" },
      { name: "ISO/IEC 27701", jurisdiction: "International", subject: "Privacy information management extension to ISO 27001", relevance: "Supports privacy control mapping, processor and controller accountability and global privacy operations.", priority: "Core" },
      { name: "ISO 22301", jurisdiction: "International", subject: "Business continuity management", relevance: "Supports continuity objectives, recovery plans, exercises and resilience evidence.", priority: "Core" },
      { name: "NIST Cybersecurity Framework 2.0", jurisdiction: "International / US origin", subject: "Cybersecurity risk governance and outcomes", relevance: "Crosswalk framework for customers using NIST terminology.", priority: "Core" },
      { name: "NIST SP 800-53 Rev 5", jurisdiction: "International / US origin", subject: "Security and privacy controls", relevance: "Detailed control library for implementation, inheritance and evidence mapping.", priority: "Core" },
      { name: "NIST SP 800-30 Rev 1", jurisdiction: "International / US origin", subject: "Information security risk assessment", relevance: "Method for threat, vulnerability, likelihood, impact and risk assessment.", priority: "Core" },
      { name: "CIS Controls v8.1", jurisdiction: "International", subject: "Prioritised technical safeguards", relevance: "Practical baseline for smaller customers and technical evidence collection.", priority: "Core" },
      { name: "SOC 2 Trust Services Criteria", jurisdiction: "International / AICPA", subject: "Service organisation controls", relevance: "Customer assurance and Trust Center evidence model. Not a government law.", priority: "Core" },
      { name: "COBIT 2019", jurisdiction: "International / ISACA", subject: "IT governance and management objectives", relevance: "Governance crosswalk for enterprise and audit customers.", priority: "Reference" },
      { name: "PCI DSS v4.0.1", jurisdiction: "International / payment cards", subject: "Protection of payment card data", relevance: "Sector-triggered where cardholder data is stored, processed or transmitted.", priority: "Sector" },
      { name: "FATF Recommendations", jurisdiction: "International / AML CFT", subject: "Anti-money laundering and counter-terrorist financing", relevance: "Anchor for AML and CTF content, risk assessment and customer due diligence.", priority: "Sector" },
      { name: "CSA Cloud Controls Matrix v4", jurisdiction: "International", subject: "Cloud security controls and shared responsibility", relevance: "Cloud provider and SaaS assurance crosswalk.", priority: "Reference" },
    ],
  },
  {
    id: "anz",
    label: "Australia and New Zealand",
    shortLabel: "Australia & NZ",
    intro: "Frameworks and regulatory regimes for the Australian and New Zealand market. Confirm applicability for each customer engagement.",
    entries: [
      { name: "Australian Government Information Security Manual", jurisdiction: "Australia", subject: "Cybersecurity principles, controls and system security guidance", relevance: "Primary Australian government-aligned catalogue and planned NOVA framework.", priority: "Core" },
      { name: "Essential Eight", jurisdiction: "Australia", subject: "Eight mitigation strategies against common cyber threats", relevance: "High-value baseline for Australian SMEs and public-sector suppliers.", priority: "Core" },
      { name: "Protective Security Policy Framework", jurisdiction: "Australia", subject: "Australian Government protective security governance", relevance: "Relevant for government-facing customers and information-security governance.", priority: "Sector" },
      { name: "Privacy Act 1988 and Australian Privacy Principles", jurisdiction: "Australia", subject: "Personal information handling and breach response", relevance: "Privacy obligations for customers handling Australian personal information.", priority: "Core" },
      { name: "Security of Critical Infrastructure Act 2018", jurisdiction: "Australia", subject: "Critical infrastructure risk management", relevance: "Sector-triggered for covered critical infrastructure customers.", priority: "Sector" },
      { name: "APRA CPS 234", jurisdiction: "Australia", subject: "Information security capability for APRA-regulated entities", relevance: "Relevant to banks, insurers, superannuation funds and material service providers.", priority: "Sector" },
      { name: "APRA CPS 230", jurisdiction: "Australia", subject: "Operational risk and service-provider resilience", relevance: "Relevant to APRA-regulated operational resilience programs.", priority: "Sector" },
      { name: "New Zealand Information Security Manual", jurisdiction: "New Zealand", subject: "New Zealand Government information-security controls", relevance: "Government and supplier assurance framework.", priority: "Core" },
      { name: "New Zealand Privacy Act 2020", jurisdiction: "New Zealand", subject: "Privacy principles and breach notification", relevance: "Relevant to New Zealand personal data processing.", priority: "Core" },
    ],
  },
  {
    id: "europe",
    label: "European Union, EEA and United Kingdom",
    shortLabel: "Europe & UK",
    intro: "Frameworks and regulatory regimes across the EU, EEA, UK and Switzerland. Confirm applicability for each customer engagement.",
    entries: [
      { name: "GDPR", jurisdiction: "EU / EEA", subject: "Personal data protection, rights, processors and transfers", relevance: "Foundational privacy framework for tenants and cross-border processing.", priority: "Core" },
      { name: "NIS2 Directive", jurisdiction: "EU / EEA", subject: "Cybersecurity risk management and incident reporting", relevance: "Relevant to qualifying customers and digital-infrastructure relationships.", priority: "Sector" },
      { name: "Digital Operational Resilience Act (DORA)", jurisdiction: "EU / EEA", subject: "ICT risk, incidents, testing and third-party risk in finance", relevance: "High priority where NOVA supports EU-regulated financial entities or ICT supply chains.", priority: "Sector" },
      { name: "EU AI Act", jurisdiction: "EU / EEA", subject: "Risk-based AI governance and transparency", relevance: "Relevant to AI-assisted features, human oversight and documentation.", priority: "Core" },
      { name: "Cyber Resilience Act", jurisdiction: "EU / EEA", subject: "Cybersecurity for products with digital elements", relevance: "Assessed where a product is marketed as in scope.", priority: "Sector" },
      { name: "eIDAS 2", jurisdiction: "EU / EEA", subject: "Electronic identification and trust services", relevance: "Relevant only where in-scope identity or trust services are offered.", priority: "Sector" },
      { name: "EU AML package and AML Regulation", jurisdiction: "EU / EEA", subject: "Harmonised AML and CTF obligations", relevance: "Important source for EU AML framework modules and workflows.", priority: "Sector" },
      { name: "UK GDPR and Data Protection Act 2018", jurisdiction: "United Kingdom", subject: "Personal data protection and privacy rights", relevance: "Core privacy regime for UK customers and data subjects.", priority: "Core" },
      { name: "FCA and PRA Operational Resilience", jurisdiction: "United Kingdom", subject: "Important business services and impact tolerances", relevance: "Relevant to UK financial customers and supporting ICT services.", priority: "Sector" },
      { name: "Cyber Essentials and Cyber Essentials Plus", jurisdiction: "United Kingdom", subject: "Baseline technical controls and verification", relevance: "Useful entry-level assurance for UK procurement.", priority: "Core" },
      { name: "Swiss Federal Data Protection Act", jurisdiction: "Switzerland", subject: "Swiss personal data protection", relevance: "Relevant for Swiss customers and data subjects.", priority: "Core" },
    ],
  },
  {
    id: "north-america",
    label: "North America",
    shortLabel: "North America",
    intro: "Frameworks and regulatory regimes across the United States and Canada. Confirm applicability for each customer engagement.",
    entries: [
      { name: "NIST Cybersecurity Framework 2.0", jurisdiction: "United States", subject: "Cybersecurity risk governance and outcomes", relevance: "Primary US crosswalk and customer-facing framework option.", priority: "Core" },
      { name: "FISMA and NIST Risk Management Framework", jurisdiction: "United States", subject: "Federal security governance and authorisation", relevance: "Relevant to US federal suppliers and systems.", priority: "Sector" },
      { name: "FedRAMP", jurisdiction: "United States", subject: "Cloud authorisation for US federal agencies", relevance: "Relevant only for US federal cloud procurement.", priority: "Sector" },
      { name: "HIPAA Security Rule", jurisdiction: "United States", subject: "Security of electronic protected health information", relevance: "Relevant to US healthcare customers and business associates.", priority: "Sector" },
      { name: "GLBA Safeguards Rule", jurisdiction: "United States", subject: "Protection of nonpublic personal information", relevance: "Relevant to US financial customers and service providers.", priority: "Sector" },
      { name: "CCPA and CPRA", jurisdiction: "California", subject: "Consumer privacy rights", relevance: "Core US privacy module for California residents.", priority: "Core" },
      { name: "NYDFS Cybersecurity Regulation 23 NYCRR 500", jurisdiction: "New York", subject: "Cybersecurity governance for covered financial entities", relevance: "Relevant to New York financial customers and service providers.", priority: "Sector" },
      { name: "SEC Cybersecurity Disclosure Rules", jurisdiction: "United States", subject: "Public-company incident and risk disclosures", relevance: "Relevant to listed-company customers and governance reporting.", priority: "Sector" },
      { name: "PIPEDA", jurisdiction: "Canada", subject: "Private-sector personal information protection", relevance: "Core Canadian privacy framework where federal jurisdiction applies.", priority: "Core" },
      { name: "Quebec Law 25", jurisdiction: "Quebec", subject: "Modernised private-sector privacy governance", relevance: "Relevant to Quebec customers and data subjects.", priority: "Core" },
      { name: "OSFI B-13", jurisdiction: "Canada", subject: "Technology and cyber risk for federally regulated institutions", relevance: "Relevant to Canadian financial customers and technology providers.", priority: "Sector" },
    ],
  },
  {
    id: "latam",
    label: "Latin America and the Caribbean",
    shortLabel: "Latin America",
    intro: "Frameworks and regulatory regimes across Latin America and the Caribbean. Confirm applicability for each customer engagement.",
    entries: [
      { name: "Brazil LGPD", jurisdiction: "Brazil", subject: "Personal data protection and incidents", relevance: "Core privacy regime for Brazil.", priority: "Core" },
      { name: "Brazil Central Bank cybersecurity and cloud rules", jurisdiction: "Brazil", subject: "Cybersecurity and outsourcing for regulated financial institutions", relevance: "Relevant to Brazilian financial customers and providers.", priority: "Sector" },
      { name: "Mexico LFPDPPP", jurisdiction: "Mexico", subject: "Private-party personal data protection", relevance: "Core Mexican privacy regime.", priority: "Core" },
      { name: "Argentina Personal Data Protection Law 25.326", jurisdiction: "Argentina", subject: "Personal data protection and transfers", relevance: "Relevant to Argentina operations and data processing.", priority: "Core" },
      { name: "Colombia Law 1581 of 2012", jurisdiction: "Colombia", subject: "Personal data protection and accountability", relevance: "Relevant to Colombian customer and employee data.", priority: "Core" },
      { name: "Chile personal data protection regime", jurisdiction: "Chile", subject: "Personal data protection and emerging obligations", relevance: "Tracked for implementation dates and sector guidance.", priority: "Core" },
      { name: "Peru Law 29733", jurisdiction: "Peru", subject: "Personal data protection and security", relevance: "Relevant to Peru customer data.", priority: "Core" },
    ],
  },
  {
    id: "middle-east",
    label: "Middle East and Israel",
    shortLabel: "Middle East",
    intro: "Frameworks and regulatory regimes across the Middle East and Israel. Confirm applicability for each customer engagement.",
    entries: [
      { name: "UAE Federal Decree Law No. 45 of 2021", jurisdiction: "United Arab Emirates", subject: "Personal data protection and transfers", relevance: "Core UAE privacy module. Free-zone rules may add requirements.", priority: "Core" },
      { name: "Saudi Personal Data Protection Law", jurisdiction: "Saudi Arabia", subject: "Personal data processing and transfers", relevance: "Core Saudi privacy module with implementing guidance.", priority: "Core" },
      { name: "Saudi NCA Essential Cybersecurity Controls", jurisdiction: "Saudi Arabia", subject: "Cybersecurity controls for government and covered entities", relevance: "Relevant to Saudi government and regulated-sector customers.", priority: "Sector" },
      { name: "SAMA Cybersecurity Framework", jurisdiction: "Saudi Arabia", subject: "Cybersecurity governance for financial institutions", relevance: "Relevant to Saudi banking and financial customers.", priority: "Sector" },
      { name: "Qatar Personal Data Privacy Protection Law", jurisdiction: "Qatar", subject: "Personal data protection", relevance: "Relevant to Qatar operations and data.", priority: "Core" },
      { name: "Bahrain Personal Data Protection Law", jurisdiction: "Bahrain", subject: "Personal data protection and transfers", relevance: "Relevant to Bahrain customers.", priority: "Core" },
      { name: "Israel Privacy Protection Law and Security Regulations", jurisdiction: "Israel", subject: "Privacy, database and information-security obligations", relevance: "Relevant to Israeli customers and security classification.", priority: "Core" },
    ],
  },
  {
    id: "africa",
    label: "Africa",
    shortLabel: "Africa",
    intro: "Frameworks and regulatory regimes across Africa. Confirm applicability for each customer engagement.",
    entries: [
      { name: "South Africa POPIA", jurisdiction: "South Africa", subject: "Protection of personal information", relevance: "Core privacy framework for South African customers.", priority: "Core" },
      { name: "Kenya Data Protection Act 2019", jurisdiction: "Kenya", subject: "Personal data protection and controller/processor duties", relevance: "Core Kenyan privacy module.", priority: "Core" },
      { name: "Nigeria Data Protection Act 2023", jurisdiction: "Nigeria", subject: "Personal data protection and accountability", relevance: "Core Nigerian privacy module.", priority: "Core" },
      { name: "Egypt Personal Data Protection Law 151 of 2020", jurisdiction: "Egypt", subject: "Personal data processing and transfers", relevance: "Relevant to Egyptian customers. Implementing rules monitored.", priority: "Core" },
      { name: "Ghana Data Protection Act 2012", jurisdiction: "Ghana", subject: "Personal data protection", relevance: "Relevant to Ghana customer data.", priority: "Core" },
      { name: "Mauritius Data Protection Act 2017", jurisdiction: "Mauritius", subject: "Data protection aligned to international principles", relevance: "Relevant to Mauritius customers.", priority: "Core" },
      { name: "Rwanda Data Protection and Privacy Law", jurisdiction: "Rwanda", subject: "Personal data protection", relevance: "Relevant to Rwanda customer data.", priority: "Core" },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    shortLabel: "Asia",
    intro: "Frameworks and regulatory regimes across Asia. Confirm applicability for each customer engagement.",
    entries: [
      { name: "Singapore Personal Data Protection Act", jurisdiction: "Singapore", subject: "Personal data protection and breach notification", relevance: "Core Singapore privacy framework.", priority: "Core" },
      { name: "MAS Technology Risk Management Guidelines", jurisdiction: "Singapore", subject: "Technology and cyber risk for financial institutions", relevance: "Relevant to Singapore financial customers and providers.", priority: "Sector" },
      { name: "Japan APPI", jurisdiction: "Japan", subject: "Personal information protection and transfers", relevance: "Core Japanese privacy module.", priority: "Core" },
      { name: "Japan FISC Security Guidelines", jurisdiction: "Japan", subject: "Security controls for financial institutions", relevance: "Relevant to Japanese financial customers.", priority: "Sector" },
      { name: "China Cybersecurity Law", jurisdiction: "China", subject: "Cybersecurity and network-operator duties", relevance: "Relevant after China market and data-residency assessment.", priority: "Sector" },
      { name: "China PIPL, Data Security Law and related measures", jurisdiction: "China", subject: "Personal information, data classification and transfers", relevance: "High-complexity China module requiring local counsel.", priority: "Sector" },
      { name: "China MLPS 2.0", jurisdiction: "China", subject: "Classified cybersecurity protection", relevance: "Relevant to covered systems operating in China.", priority: "Sector" },
      { name: "India Digital Personal Data Protection Act 2023", jurisdiction: "India", subject: "Digital personal data processing", relevance: "Core India privacy module. Commencement rules tracked.", priority: "Core" },
      { name: "India CERT-In Directions", jurisdiction: "India", subject: "Cyber incident reporting and logging", relevance: "Relevant to India operations and covered providers.", priority: "Sector" },
      { name: "South Korea PIPA and ISMS-P", jurisdiction: "South Korea", subject: "Personal data protection and security certification", relevance: "Core privacy plus procurement assurance module.", priority: "Core" },
      { name: "Hong Kong PDPO", jurisdiction: "Hong Kong", subject: "Personal data protection", relevance: "Core Hong Kong privacy module.", priority: "Core" },
      { name: "Indonesia Personal Data Protection Law No. 27 of 2022", jurisdiction: "Indonesia", subject: "Personal data processing and governance", relevance: "Core Indonesia privacy module.", priority: "Core" },
      { name: "Malaysia PDPA and BNM RMiT", jurisdiction: "Malaysia", subject: "Privacy and financial technology risk", relevance: "PDPA applies broadly, RMiT for financial customers.", priority: "Sector" },
      { name: "Thailand PDPA", jurisdiction: "Thailand", subject: "Personal data protection and transfers", relevance: "Core Thailand privacy module.", priority: "Core" },
      { name: "Philippines Data Privacy Act", jurisdiction: "Philippines", subject: "Personal data protection and accountability", relevance: "Core Philippines privacy module.", priority: "Core" },
      { name: "Vietnam Decree 13 on Personal Data Protection", jurisdiction: "Vietnam", subject: "Personal data processing and impact assessments", relevance: "Relevant to Vietnam operations. Superseding rules monitored.", priority: "Core" },
    ],
  },
];
