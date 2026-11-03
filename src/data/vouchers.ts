// Central data for Udemy Certification Exam Vouchers (CourseSpeak)
// Affiliate: Udemy Impact c/6564357/4028133/39854
// Images: /assets/images/vouchers/*.svg (proper exam-ticket artwork, shared set).

export const AFFILIATE_BASE = "https://trk.udemy.com/c/6564357/4028133/39854";
export const ALL_VOUCHERS_URL = `${AFFILIATE_BASE}?u=https%3A%2F%2Fwww.udemy.com%2Fall-certification-vouchers%2F`;

function v(path: string) {
  return `${AFFILIATE_BASE}?u=https%3A%2F%2Fwww.udemy.com%2Fcertification-vouchers%2F${path}%2F`;
}
function img(file: string) {
  return `/assets/images/vouchers/${file}.svg`;
}

export type VoucherStatus = "active" | "updated" | "retiring" | "retired";

export interface Voucher {
  code: string;
  title: string;
  category: string;
  provider: "comptia" | "aws" | "microsoft";
  image: string;
  blurb: string;
  url: string;
  badge?: string;
  note?: string;
  status?: VoucherStatus;
}

const COMPTIA_VOUCHER_PRICES: Record<string, string> = {
  "FC0-U71": "$113–$116",
  "220-1201 / 220-1202": "$240–$247",
  "N10-009": "$349–$359",
  "SY0-701": "$384–$395",
  "CS0-004": "$384–$395",
  "PT0-003": "$384–$395",
  "CAS-005": "$476–$490",
  "XK0-006": "$349–$359",
  "CV0-004": "$349–$359",
  "SK0-005": "$349–$359",
  "CNX-001": "$476–$490",
  "DA0-002": "$231–$238",
  "DS0-002": "$349–$359",
  "DY0-001": "$476–$490",
  "PK0-005": "$349–$359",
};

/** Voucher-only street price shown in the compact product cards. */
export function voucherPrice(v: Voucher): string {
  if (v.provider === "comptia") return COMPTIA_VOUCHER_PRICES[v.code] ?? "Check price";
  if (v.provider === "aws") {
    if (v.category === "Foundational") return "$90";
    if (v.category === "Associate") return "$135";
    return "$270";
  }
  return v.code.endsWith("-900") ? "$89.10" : "$148.50";
}

export const comptiaVouchers: Voucher[] = [
  { code: "FC0-U71", title: "CompTIA Tech+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-tech-plus"), blurb: "Entry-level fundamentals. $129 retail, about $116 on Udemy. No prerequisites. Valid ≥9 months.", url: v("comptia-tech-plus") },
  { code: "220-1201 / 220-1202", title: "CompTIA A+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-a-plus"), blurb: "One voucher covers Core 1 or Core 2 — not both. $274 retail per core; budget for two vouchers ($548 total).", url: v("comptia-a-plus") },
  { code: "N10-009", title: "CompTIA Network+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-network-plus"), blurb: "Current Network+ V9. $399 retail, about $359 on Udemy. N10-010 draft exists but has no launch date.", url: v("comptia-network-plus") },
  { code: "SY0-701", title: "CompTIA Security+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-security-plus"), blurb: "SY0-701 is current; SY0-801 launches Nov 17, 2026, and SY0-701 retires June 11, 2027. $439 retail, about $384–$395 on Udemy.", url: v("comptia-security-plus"), badge: "SY0-801 watch", note: "Udemy currently sells the SY0-701 voucher. Confirm which version your code books before paying.", status: "updated" },
  { code: "CS0-004", title: "CompTIA CySA+ Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-cysa-plus"), blurb: "Current CySA+ V4. $439 retail, about $395 on Udemy. The older CS0-003 exam retires Dec 22, 2026 in English.", url: v("comptia-cysa-plus"), badge: "V4", note: "Buy the CS0-004 voucher, not leftover CS0-003 stock. CS0-003 retires Dec 22, 2026 (English).", status: "updated" },
  { code: "PT0-003", title: "CompTIA PenTest+ Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-pentest-plus"), blurb: "Current PenTest+ V3. $439 retail, about $395 on Udemy. 165 minutes, performance-based. No PT0-004 announced.", url: v("comptia-pentest-plus") },
  { code: "CAS-005", title: "CompTIA SecurityX Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-securityx"), blurb: "Expert-level security architect exam (formerly CASP+). $544 retail, about $490 on Udemy. Pass/fail scoring.", url: v("comptia-securityx") },
  { code: "XK0-006", title: "CompTIA Linux+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-linux-plus"), blurb: "Current Linux+ V8. $399 retail, about $359 on Udemy. Launched July 2025; estimated retirement 2028.", url: v("comptia-linux-plus") },
  { code: "CV0-004", title: "CompTIA Cloud+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-cloud-plus"), blurb: "Current Cloud+ V4. $399 retail, about $359 on Udemy. Vendor-neutral cloud operations and architecture.", url: v("comptia-cloud-plus") },
  { code: "SK0-005", title: "CompTIA Server+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-server-plus"), blurb: "Current Server+ V5. $399 retail, about $359 on Udemy. Draft SK0-006 objectives exist, but no launch date.", url: v("comptia-server-plus") },
  { code: "CNX-001", title: "CompTIA CloudNetX Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-cloudnetx"), blurb: "Expert-level cloud network architect exam. $544 retail, about $490 on Udemy. Pass/fail scoring.", url: v("comptia-cloudnetx") },
  { code: "DA0-002", title: "CompTIA Data+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-data-plus"), blurb: "Current Data+ V2 (launched Oct 2025). $264 retail, about $238 on Udemy. The cheapest data certification in the range.", url: v("comptia-data-plus") },
  { code: "DS0-002", title: "CompTIA DataSys+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-datasys-plus"), blurb: "DataSys+ V2 (DS0-002) launched Oct 13, 2026. V1 (DS0-001) retires Apr 16, 2027. $399 retail; confirm the version at checkout.", url: v("comptia-datasys-plus"), badge: "V2", note: "Udemy's DataSys+ page is generic. CompTIA's current exam is DS0-002; DS0-001 retires Apr 16, 2027.", status: "updated" },
  { code: "DY0-001", title: "CompTIA DataAI Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-data-ai"), blurb: "Expert-level data science and AI exam (formerly DataX). $544 retail, about $490 on Udemy. Pass/fail scoring.", url: v("comptia-data-ai") },
  { code: "PK0-005", title: "CompTIA Project+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-project-plus"), blurb: "Current Project+ V5. $399 retail, about $359 on Udemy. IT project management fundamentals; no prerequisite.", url: v("comptia-project-plus") },
];

export const awsVouchers: Voucher[] = [
  { code: "CLF-C02", title: "AWS Certified Cloud Practitioner Exam Voucher", category: "Foundational", provider: "aws", image: img("aws-certified-cloud-practitioner"), blurb: "Foundational. Voucher only $90 (retail $100); Second Chance bundle $115.50. Valid ≥9 months.", url: v("aws-certified-cloud-practitioner"), status: "active" },
  { code: "AIF-C01", title: "AWS Certified AI Practitioner Exam Voucher", category: "Foundational", provider: "aws", image: img("aws-certified-ai-practitioner"), blurb: "Foundational. Voucher only $90 (retail $100); Second Chance bundle $115.50. Valid ≥9 months.", url: v("aws-certified-ai-practitioner"), status: "active" },
  { code: "SAA-C03", title: "AWS Solutions Architect – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-solutions-architect-associate"), blurb: "Associate. Voucher only $135 (retail $150); Second Chance bundle $177.80. Covers all Associate exams.", url: v("aws-certified-solutions-architect-associate"), status: "active" },
  { code: "DVA-C03", title: "AWS Developer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-developer-associate"), blurb: "Associate. DVA-C02 through Nov 30, 2026; DVA-C03 from Dec 1. Voucher only $135; Second Chance bundle $177.80.", url: v("aws-certified-developer-associate"), badge: "Updated", note: "DVA-C02 last day Nov 30, 2026. DVA-C03 registration opened Oct 27; GA Dec 1.", status: "updated" },
  { code: "DEA-C01", title: "AWS Data Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-data-engineer-associate"), blurb: "Associate. Voucher only $135 (retail $150); Second Chance bundle $177.80. Covers all Associate exams.", url: v("aws-certified-data-engineer-associate"), status: "active" },
  { code: "SOA-C03", title: "AWS CloudOps Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-cloudops-engineer-associate"), blurb: "Associate. Formerly SysOps Administrator. Voucher only $135; Second Chance bundle $177.80. Covers all Associate exams.", url: v("aws-certified-cloudops-engineer-associate"), status: "active" },
  { code: "MLA-C02", title: "AWS ML Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-machine-learning-engineer-associate"), blurb: "Associate. MLA-C02 beta is open at $75; GA Jan 14, 2027. Voucher only $135 for the standard exam; Second Chance bundle $177.80.", url: v("aws-certified-machine-learning-engineer-associate"), badge: "Beta", note: "MLA-C01 English retired Sept 28, 2026. MLA-C02 beta runs now; standard exam pricing starts Jan 14, 2027. The Associate voucher is tier-wide.", status: "updated" },
  { code: "SAP-C03", title: "AWS Solutions Architect – Professional Exam Voucher", category: "Professional", provider: "aws", image: img("aws-certified-solutions-architect-professional"), blurb: "Professional. SAP-C02 through Nov 16, 2026; SAP-C03 from Nov 17. Voucher only $270; Second Chance bundle $348.80.", url: v("aws-certified-solutions-architect-professional"), badge: "Updated", note: "SAP-C02 last day Nov 16, 2026. SAP-C03 registration opened Oct 27; GA Nov 17.", status: "updated" },
  { code: "DOP-C02", title: "AWS DevOps Engineer – Professional Exam Voucher", category: "Professional", provider: "aws", image: img("aws-certified-devops-engineer-professional"), blurb: "Professional. Voucher only $270 (retail $300); Second Chance bundle $348.80. Valid ≥9 months.", url: v("aws-certified-devops-engineer-professional"), status: "active" },
  { code: "SCS-C03", title: "AWS Security – Specialty Exam Voucher", category: "Specialty", provider: "aws", image: img("aws-certified-security-specialty"), blurb: "Specialty. The active AWS Specialty exam. Voucher only $270; Second Chance bundle $348.80. Valid ≥9 months.", url: v("aws-certified-security-specialty"), status: "active" },
  { code: "MLS-C01", title: "AWS Machine Learning – Specialty Exam Voucher (legacy listing)", category: "Specialty", provider: "aws", image: img("aws-certified-machine-learning-specialty"), blurb: "Exam retired March 31, 2026. This Professional/Specialty voucher is tier-wide and can still be used for any active Pro/Specialty exam.", url: v("aws-certified-machine-learning-specialty"), badge: "Retired", note: "MLS-C01 retired Mar 31, 2026. The voucher remains usable across the Pro/Specialty tier.", status: "retired" },
  { code: "ANS-C01", title: "AWS Advanced Networking – Specialty Exam Voucher", category: "Specialty", provider: "aws", image: img("aws-certified-advanced-networking-specialty"), blurb: "Retiring Dec 31, 2026 — no replacement announced. Voucher is tier-wide and can be used for any active Pro/Specialty exam.", url: v("aws-certified-advanced-networking-specialty"), badge: "Retiring", note: "ANS-C01 last day Dec 31, 2026. No replacement exam announced.", status: "retiring" },
];

// Eight highest-demand Microsoft voucher pages featured as cards. The full
// 50-page catalogue lives in microsoftCatalog below.
export const microsoftVouchers: Voucher[] = [
  { code: "AZ-900", title: "Azure Fundamentals Exam Voucher", category: "Fundamentals", provider: "microsoft", image: img("microsoft-az-900"), blurb: "Fundamentals. About $89.10 vs $99 list. No prerequisites; the most-requested first Microsoft cert. Valid ≥9 months.", url: v("microsoft-az-900"), status: "active" },
  { code: "DP-900", title: "Azure Data Fundamentals Exam Voucher", category: "Fundamentals", provider: "microsoft", image: img("microsoft-dp-900"), blurb: "Fundamentals. About $89.10 vs $99 list. Core data, relational and non-relational concepts. Valid ≥9 months.", url: v("microsoft-dp-900"), status: "active" },
  { code: "AZ-104", title: "Azure Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-az-104"), blurb: "Associate. About $148.50 vs $165 list. The core Azure admin cert; Retake Assurance optional. Valid ≥9 months.", url: v("microsoft-az-104"), status: "active" },
  { code: "MD-102", title: "Endpoint Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-md-102"), blurb: "Associate. About $148.50 vs $165 list. Intune, Windows and endpoint management. Retake Assurance optional.", url: v("microsoft-md-102"), status: "active" },
  { code: "SC-200", title: "Security Operations Analyst Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-sc-200"), blurb: "Associate. About $148.50 vs $165 list. Microsoft Sentinel and Defender XDR. Retake Assurance optional.", url: v("microsoft-sc-200"), status: "active" },
  { code: "DP-300", title: "Azure Database Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-dp-300"), blurb: "Associate. About $148.50 vs $165 list. Azure SQL performance, security and availability. Retake Assurance optional.", url: v("microsoft-dp-300"), status: "active" },
  { code: "AZ-400", title: "DevOps Engineer Expert Exam Voucher", category: "Expert", provider: "microsoft", image: img("microsoft-az-400"), blurb: "Expert. About $148.50 vs $165 list. CI/CD, GitHub Actions and Azure DevOps. An Associate prerequisite is required.", url: v("microsoft-az-400"), status: "active" },
  { code: "AZ-305", title: "Azure Solutions Architect Expert Exam Voucher", category: "Expert", provider: "microsoft", image: img("microsoft-az-305"), blurb: "Expert. About $148.50 vs $165 list. Design identity, data, infrastructure and migration. Associate-level knowledge expected.", url: v("microsoft-az-305"), status: "active" },
];

export type MicrosoftCatalogStatus = "current" | "retiring" | "retired";

export interface MicrosoftCatalogEntry {
  code: string;
  name: string;
  family: "Fundamentals" | "Azure" | "Data & AI" | "Security" | "Microsoft 365" | "Power Platform" | "Dynamics 365" | "GitHub" | "Legacy";
  level: "Fundamentals" | "Associate" | "Expert" | "Specialty" | "Other";
  status: MicrosoftCatalogStatus;
  replacement?: string;
  note?: string;
  url: string;
}

// Audited 3 November 2026: 50 live Microsoft voucher pages on Udemy.
// 33 map to current exams, 1 is retiring (MS-102), 16 are retired or legacy.
export const microsoftCatalog: MicrosoftCatalogEntry[] = [
  // Fundamentals
  { code: "AZ-900", name: "Microsoft Azure Fundamentals", family: "Fundamentals", level: "Fundamentals", status: "current", url: v("microsoft-az-900") },
  { code: "DP-900", name: "Microsoft Azure Data Fundamentals", family: "Fundamentals", level: "Fundamentals", status: "current", url: v("microsoft-dp-900") },
  { code: "SC-900", name: "Microsoft Security, Compliance, and Identity Fundamentals", family: "Fundamentals", level: "Fundamentals", status: "current", url: v("microsoft-sc-900") },
  { code: "PL-900", name: "Microsoft Power Platform Fundamentals", family: "Fundamentals", level: "Fundamentals", status: "current", url: v("microsoft-pl-900") },
  { code: "GH-900", name: "GitHub Foundations", family: "Fundamentals", level: "Fundamentals", status: "current", url: v("microsoft-gh-900") },
  { code: "AI-900", name: "Microsoft Azure AI Fundamentals", family: "Fundamentals", level: "Fundamentals", status: "retired", replacement: "AI-901", note: "Exam retired June 30, 2026. Udemy still sells the AI-900 page; do not buy it if you need the current exam.", url: v("microsoft-ai-900") },

  // Azure
  { code: "AZ-104", name: "Microsoft Azure Administrator", family: "Azure", level: "Associate", status: "current", url: v("microsoft-az-104") },
  { code: "AZ-305", name: "Microsoft Azure Solutions Architect Expert", family: "Azure", level: "Expert", status: "current", url: v("microsoft-az-305") },
  { code: "AZ-400", name: "Microsoft DevOps Engineer Expert", family: "Azure", level: "Expert", status: "current", url: v("microsoft-az-400") },
  { code: "AZ-700", name: "Microsoft Azure Network Engineer Associate", family: "Azure", level: "Associate", status: "current", url: v("microsoft-az-700") },
  { code: "AZ-120", name: "Microsoft Azure for SAP Workloads Specialty", family: "Azure", level: "Specialty", status: "current", url: v("microsoft-az-120") },
  { code: "AZ-140", name: "Microsoft Azure Virtual Desktop Specialty", family: "Azure", level: "Specialty", status: "current", url: v("microsoft-az-140") },
  { code: "AZ-204", name: "Microsoft Azure Developer Associate", family: "Azure", level: "Associate", status: "retired", replacement: "AI-200", note: "Retired July 31, 2026.", url: v("microsoft-az-204") },
  { code: "AZ-500", name: "Microsoft Azure Security Engineer Associate", family: "Azure", level: "Associate", status: "retired", replacement: "SC-500", note: "Retired August 31, 2026.", url: v("microsoft-az-500") },
  { code: "AZ-800", name: "Windows Server Hybrid Administrator Associate (Part 1)", family: "Azure", level: "Associate", status: "retired", replacement: "AZ-802", note: "Retired September 30, 2026; AZ-802 replaces both AZ-800 and AZ-801.", url: v("microsoft-az-800") },
  { code: "AZ-801", name: "Windows Server Hybrid Administrator Associate (Part 2)", family: "Azure", level: "Associate", status: "retired", replacement: "AZ-802", note: "Retired September 30, 2026; AZ-802 replaces both AZ-800 and AZ-801.", url: v("microsoft-az-801") },

  // Data & AI
  { code: "DP-300", name: "Microsoft Azure Database Administrator Associate", family: "Data & AI", level: "Associate", status: "current", url: v("microsoft-dp-300") },
  { code: "DP-420", name: "Microsoft Azure Cosmos DB Developer Specialty", family: "Data & AI", level: "Specialty", status: "current", url: v("microsoft-dp-420") },
  { code: "DP-600", name: "Microsoft Fabric Analytics Engineer Associate", family: "Data & AI", level: "Associate", status: "current", url: v("microsoft-dp-600") },
  { code: "DP-700", name: "Microsoft Fabric Data Engineer Associate", family: "Data & AI", level: "Associate", status: "current", url: v("microsoft-dp-700") },
  { code: "AI-102", name: "Microsoft Azure AI Engineer Associate", family: "Data & AI", level: "Associate", status: "retired", replacement: "AI-103", note: "Retired June 30, 2026.", url: v("microsoft-ai-102") },
  { code: "DP-100", name: "Microsoft Azure Data Scientist Associate", family: "Data & AI", level: "Associate", status: "retired", replacement: "AI-300", note: "Retired June 1, 2026.", url: v("microsoft-dp-100") },

  // Security
  { code: "SC-200", name: "Microsoft Security Operations Analyst", family: "Security", level: "Associate", status: "current", url: v("microsoft-sc-200") },
  { code: "SC-300", name: "Microsoft Identity and Access Administrator", family: "Security", level: "Associate", status: "current", url: v("microsoft-sc-300") },
  { code: "SC-401", name: "Microsoft Information Security Administrator", family: "Security", level: "Associate", status: "current", url: v("microsoft-sc-401") },
  { code: "SC-100", name: "Microsoft Cybersecurity Architect", family: "Security", level: "Expert", status: "current", url: v("microsoft-sc-100") },

  // Microsoft 365
  { code: "MD-102", name: "Microsoft Endpoint Administrator", family: "Microsoft 365", level: "Associate", status: "current", url: v("microsoft-md-102") },
  { code: "MS-700", name: "Microsoft Teams Administrator Associate", family: "Microsoft 365", level: "Associate", status: "current", url: v("microsoft-ms-700") },
  { code: "MS-721", name: "Microsoft Collaboration Communications Systems Engineer Associate", family: "Microsoft 365", level: "Associate", status: "current", url: v("microsoft-ms-721") },
  { code: "MS-102", name: "Microsoft 365 Administrator Expert", family: "Microsoft 365", level: "Expert", status: "retiring", replacement: "AB-650", note: "Retires November 30, 2026. AB-650 is the replacement path but is an Associate exam, not a like-for-like Expert swap.", url: v("microsoft-ms-102") },

  // Power Platform
  { code: "PL-300", name: "Microsoft Power BI Data Analyst", family: "Power Platform", level: "Associate", status: "current", url: v("microsoft-pl-300") },
  { code: "PL-200", name: "Microsoft Power Platform Functional Consultant", family: "Power Platform", level: "Associate", status: "retired", replacement: "AB-410", note: "Retired August 31, 2026.", url: v("microsoft-pl-200") },
  { code: "PL-400", name: "Microsoft Power Platform Developer", family: "Power Platform", level: "Associate", status: "retired", replacement: "AB-400 courseware", note: "Retired October 30, 2026. No replacement voucher page is live yet.", url: v("microsoft-pl-400") },
  { code: "PL-500", name: "Microsoft Power Automate RPA Developer", family: "Power Platform", level: "Associate", status: "retired", note: "Retired June 30, 2026; no direct replacement announced.", url: v("microsoft-pl-500") },
  { code: "PL-600", name: "Microsoft Power Platform Solution Architect Expert", family: "Power Platform", level: "Expert", status: "retired", replacement: "AB-100 path", note: "Retired June 30, 2026; Microsoft points architects to AB-100.", url: v("microsoft-pl-600") },

  // Dynamics 365
  { code: "MB-230", name: "Microsoft Dynamics 365 Customer Service Functional Consultant", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-230") },
  { code: "MB-310", name: "Microsoft Dynamics 365 Finance Functional Consultant", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-310") },
  { code: "MB-330", name: "Microsoft Dynamics 365 Supply Chain Management Functional Consultant", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-330") },
  { code: "MB-500", name: "Microsoft Dynamics 365 Finance and Operations Apps Developer", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-500") },
  { code: "MB-800", name: "Microsoft Dynamics 365 Business Central Functional Consultant", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-800") },
  { code: "MB-820", name: "Microsoft Dynamics 365 Business Central Developer", family: "Dynamics 365", level: "Associate", status: "current", url: v("microsoft-mb-820") },
  { code: "MB-240", name: "Microsoft Dynamics 365 Field Service Functional Consultant", family: "Dynamics 365", level: "Associate", status: "retired", replacement: "AB-250 (adjacent)", note: "Retired June 30, 2026; no direct replacement.", url: v("microsoft-mb-240") },
  { code: "MB-280", name: "Microsoft Dynamics 365 Customer Experience Analyst", family: "Dynamics 365", level: "Associate", status: "retired", replacement: "AB-210", note: "Retired July 31, 2026.", url: v("microsoft-mb-280") },
  { code: "MB-335", name: "Microsoft Dynamics 365 Supply Chain Management Functional Consultant Expert", family: "Dynamics 365", level: "Expert", status: "retired", replacement: "AB-100 path", note: "Retired June 30, 2026; no direct replacement.", url: v("microsoft-mb-335") },
  { code: "MB-700", name: "Microsoft Dynamics 365 Finance and Operations Apps Solution Architect Expert", family: "Dynamics 365", level: "Expert", status: "retired", replacement: "AB-100 path", note: "Retired June 30, 2026; no direct replacement.", url: v("microsoft-mb-700") },

  // GitHub
  { code: "GH-100", name: "GitHub Enterprise Administrator", family: "GitHub", level: "Associate", status: "current", url: v("microsoft-gh-100") },
  { code: "GH-200", name: "GitHub Actions", family: "GitHub", level: "Associate", status: "current", url: v("microsoft-gh-200") },
  { code: "GH-300", name: "GitHub Copilot", family: "GitHub", level: "Associate", status: "current", url: v("microsoft-gh-300") },
  { code: "GH-500", name: "GitHub Advanced Security", family: "GitHub", level: "Associate", status: "current", url: v("microsoft-gh-500") },

  // Legacy
  { code: "62-193", name: "Microsoft Certified Educator", family: "Legacy", level: "Other", status: "retired", note: "Legacy educator exam listing. It is not part of the role-based certification catalogue.", url: v("microsoft-62-193") },
];

export const allVouchers = [...comptiaVouchers, ...awsVouchers, ...microsoftVouchers];

export const voucherPageCount = comptiaVouchers.length + awsVouchers.length + microsoftCatalog.length;
export const currentExamCount = 58;
export const microsoftCurrentCount = microsoftCatalog.filter((x) => x.status === "current").length;

export const providerMeta = {
  comptia: { name: "CompTIA", count: 15, color: "#C20D00", page: "/udemy-comptia-exam-vouchers", image: "/assets/images/vouchers/provider-comptia.svg", desc: "Security+ SY0-701, A+ 220-1201/1202, Network+ N10-009, CySA+ CS0-004, PenTest+ PT0-003, Linux+ XK0-006, Cloud+ CV0-004, DataSys+ DS0-002, DataAI DY0-001 and more." },
  aws: { name: "AWS", count: 12, color: "#FF9900", page: "/udemy-aws-exam-vouchers", image: "/assets/images/vouchers/provider-aws.svg", desc: "Cloud Practitioner CLF-C02, Solutions Architect SAA-C03, Professional SAP-C03, Developer DVA-C03, Security SCS-C03. 12 voucher products, 10 current exams. Pearson VUE scheduling." },
  microsoft: { name: "Microsoft", count: 50, color: "#00A4EF", page: "/udemy-microsoft-exam-vouchers", image: "/assets/images/vouchers/provider-microsoft.svg", desc: "50 live voucher pages, 33 current exams — AZ-900, AZ-104, AZ-305, AZ-400, SC-200, DP-300, MD-102 and more. Retired 2026 exam pages are flagged." },
};

export const comptiaGroupBlurbs: Record<string, string> = {
  "Core Certifications": "The entry-level path employers ask for first. Tech+ for absolute beginners, A+ for IT support roles, Network+ for networking fundamentals, and Security+ for the first cybersecurity job. A+ is two exams, so budget for two vouchers.",
  "Cybersecurity": "Mid- to senior-level security roles. Take these after Security+: CySA+ for SOC analysts, PenTest+ for penetration testers, and SecurityX for security architects. CySA+ moved to CS0-004 in June 2026.",
  "Infrastructure & Cloud": "Linux, cloud, servers and cloud networking for sysadmins and infrastructure engineers. Linux+ and Cloud+ appear most often in job posts; Server+ goes deeper on hardware, and CloudNetX is the expert cloud-network credential.",
  "Data & Project": "Data analytics, database administration, AI and IT project management. Data+ is the cheapest entry point; DataSys+ moved to V2 (DS0-002) in October 2026; DataAI is expert-level; Project+ covers IT project delivery.",
};

export const awsGroupBlurbs: Record<string, string> = {
  "Foundational": "The zero-experience starting point. Cloud Practitioner CLF-C02 and AI Practitioner AIF-C01 need only 1-3 weeks of study and have no prerequisites.",
  "Associate": "The job-getter tier and the most requested AWS certs in job listings. Solutions Architect SAA-C03 is the flagship; Developer moves to DVA-C03 on Dec 1, Data Engineer DEA-C01 and CloudOps SOA-C03 are current, and ML Engineer MLA-C02 is in beta until its Jan 14, 2027 GA.",
  "Professional": "Advanced architect and DevOps roles for experienced practitioners. SAP-C03 replaced SAP-C02 on Nov 17, 2026; DOP-C02 remains current. Take one after an Associate cert, not before.",
  "Specialty": "Security SCS-C03 is the active Specialty exam. Machine Learning Specialty retired March 31, 2026, and Advanced Networking retires Dec 31, 2026 — their voucher listings remain tier-wide, so they still work for any active Pro/Specialty exam.",
};

export const microsoftGroupBlurbs: Record<string, string> = {
  "Fundamentals": "Your first Microsoft cert. AZ-900 and DP-900 cost about $89.10 on Udemy against a $99 list price, need 2-4 weeks of study, and have no prerequisites. Avoid the AI-900 page: that exam retired on June 30, 2026.",
  "Associate": "Role-based administrator and engineer certifications that form the core of most Azure, security and modern-work job requirements: AZ-104, MD-102, SC-200 and DP-300 are featured here; the full catalogue also covers AZ-700, SC-300, DP-600 and more.",
  "Expert": "The capstone tier. AZ-400 and AZ-305 cost about $148.50 against a $165 list price and assume Associate-level hands-on experience. Microsoft exams are scenario-heavy, so do not book before two clean practice runs.",
};

export const microsoftFamilyOrder = ["Fundamentals", "Azure", "Data & AI", "Security", "Microsoft 365", "Power Platform", "Dynamics 365", "GitHub", "Legacy"] as const;

export const microsoftFamilyBlurbs: Record<string, string> = {
  "Fundamentals": "Five current fundamentals exams plus the retired AI-900 page. Fundamentals certifications do not expire; they are the cheapest credible signal on a résumé.",
  "Azure": "The core Azure administrator, architect, DevOps, networking and specialty exams. Four Azure pages now point to retired exams — check the status column before buying.",
  "Data & AI": "Azure SQL, Cosmos DB and Microsoft Fabric. AI-102 and DP-100 are retired; their replacements (AI-103 and AI-300) do not have Udemy voucher pages yet.",
  "Security": "Four current security exams: SC-200 for SOC analysts, SC-300 for identity, SC-401 for information security administration, and SC-100 for architects. AZ-500 is retired; SC-500 has no Udemy page yet.",
  "Microsoft 365": "Endpoint, Teams and collaboration administration. MS-102 is the only current Microsoft exam with a published retirement date: November 30, 2026.",
  "Power Platform": "PL-300 is the only current Power Platform voucher left. PL-200, PL-400, PL-500 and PL-600 all retired in 2026, although their Udemy pages remain live.",
  "Dynamics 365": "Six current functional-consultant and developer exams. Four retired Dynamics pages are still sold; MB-280, MB-335, MB-700 and MB-240 cannot be booked any more.",
  "GitHub": "GitHub administration, Actions, Copilot and Advanced Security. All four role-based GitHub vouchers are current; GH-900 sits in Fundamentals.",
  "Legacy": "The Microsoft Certified Educator page (62-193) is a legacy listing outside the role-based certification catalogue.",
};
