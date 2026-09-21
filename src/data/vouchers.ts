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

export interface Voucher {
  code: string;
  title: string;
  category: string;
  provider: "comptia" | "aws" | "microsoft";
  image: string;
  blurb: string;
  url: string;
  badge?: string;
}

export const comptiaVouchers: Voucher[] = [
  { code: "SY0-701", title: "CompTIA Security+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-security-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Online or in-person. Retail ~$404.", url: v("comptia-security-plus") },
  { code: "Core 1 & Core 2", title: "CompTIA A+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-a-plus"), blurb: "Valid ≥9 months. One voucher covers Core 1 or Core 2 (~$253 each).", url: v("comptia-a-plus") },
  { code: "N10-009", title: "CompTIA Network+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-network-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$358.", url: v("comptia-network-plus") },
  { code: "Fundamentals", title: "CompTIA Tech+ Exam Voucher", category: "Core Certifications", provider: "comptia", image: img("comptia-tech-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Entry-level fundamentals.", url: v("comptia-tech-plus") },
  { code: "Analyst", title: "CompTIA CySA+ Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-cysa-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$392.", url: v("comptia-cysa-plus") },
  { code: "Pen Testing", title: "CompTIA PenTest+ Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-pentest-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$392.", url: v("comptia-pentest-plus") },
  { code: "Expert", title: "CompTIA SecurityX Exam Voucher", category: "Cybersecurity", provider: "comptia", image: img("comptia-securityx"), blurb: "Voucher + Second Chance valid ≥9 months. Expert-level security.", url: v("comptia-securityx") },
  { code: "Linux", title: "CompTIA Linux+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-linux-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$358.", url: v("comptia-linux-plus") },
  { code: "Cloud", title: "CompTIA Cloud+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-cloud-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$358.", url: v("comptia-cloud-plus") },
  { code: "Cloud Networking", title: "CompTIA CloudNetX Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-cloudnetx"), blurb: "Voucher valid ≥9 months. New cert — check live Udemy price.", url: v("comptia-cloudnetx"), badge: "New" },
  { code: "Servers", title: "CompTIA Server+ Exam Voucher", category: "Infrastructure & Cloud", provider: "comptia", image: img("comptia-server-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Retail ~$358.", url: v("comptia-server-plus") },
  { code: "Data", title: "CompTIA Data+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-data-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Data analytics path.", url: v("comptia-data-plus") },
  { code: "Database", title: "CompTIA DataSys+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-datasys-plus"), blurb: "Voucher + Second Chance valid ≥9 months. Database admin path.", url: v("comptia-datasys-plus") },
  { code: "AI & Data", title: "CompTIA DataAI Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-data-ai"), blurb: "Voucher + Second Chance valid ≥9 months. New AI/data cert.", url: v("comptia-data-ai"), badge: "New" },
  { code: "Project", title: "CompTIA Project+ Exam Voucher", category: "Data & Project", provider: "comptia", image: img("comptia-project-plus"), blurb: "Voucher + Second Chance valid ≥9 months. IT project management.", url: v("comptia-project-plus") },
];

export const awsVouchers: Voucher[] = [
  { code: "CLF-C02", title: "AWS Certified Cloud Practitioner Exam Voucher", category: "Foundational", provider: "aws", image: img("aws-certified-cloud-practitioner"), blurb: "Foundational exams. Voucher + Second Chance ≥9 mo. Retail $100.", url: v("aws-certified-cloud-practitioner") },
  { code: "AIF-C01", title: "AWS Certified AI Practitioner Exam Voucher", category: "Foundational", provider: "aws", image: img("aws-certified-ai-practitioner"), blurb: "Foundational exams. Valid ≥9 months. Retail $100.", url: v("aws-certified-ai-practitioner"), badge: "New" },
  { code: "SAA-C03", title: "AWS Solutions Architect – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-solutions-architect-associate"), blurb: "All Associate exams. Valid ≥9 months. Retail $150.", url: v("aws-certified-solutions-architect-associate") },
  { code: "Developer", title: "AWS Developer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-developer-associate"), blurb: "All Associate exams. Voucher + Second Chance ≥9 mo.", url: v("aws-certified-developer-associate") },
  { code: "Data", title: "AWS Data Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-data-engineer-associate"), blurb: "All Associate exams. Voucher + Second Chance ≥9 mo.", url: v("aws-certified-data-engineer-associate") },
  { code: "Operations", title: "AWS CloudOps Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-cloudops-engineer-associate"), blurb: "All Associate exams. Voucher + Second Chance ≥9 mo.", url: v("aws-certified-cloudops-engineer-associate") },
  { code: "Machine Learning", title: "AWS ML Engineer – Associate Exam Voucher", category: "Associate", provider: "aws", image: img("aws-certified-machine-learning-engineer-associate"), blurb: "All Associate exams. Voucher + Second Chance ≥9 mo.", url: v("aws-certified-machine-learning-engineer-associate") },
  { code: "Architect", title: "AWS Solutions Architect – Professional Exam Voucher", category: "Professional", provider: "aws", image: img("aws-certified-solutions-architect-professional"), blurb: "Pro & Specialty exams. Valid ≥9 months. Retail $300.", url: v("aws-certified-solutions-architect-professional") },
  { code: "DevOps", title: "AWS DevOps Engineer – Professional Exam Voucher", category: "Professional", provider: "aws", image: img("aws-certified-devops-engineer-professional"), blurb: "Pro & Specialty exams. + Second Chance. Retail $300.", url: v("aws-certified-devops-engineer-professional") },
  { code: "Security", title: "AWS Security – Specialty Exam Voucher", category: "Specialty", provider: "aws", image: img("aws-certified-security-specialty"), blurb: "Pro & Specialty exams. + Second Chance. Retail $300.", url: v("aws-certified-security-specialty") },
  { code: "Machine Learning", title: "AWS Machine Learning – Specialty Exam Voucher", category: "Specialty", provider: "aws", image: img("aws-certified-machine-learning-specialty"), blurb: "Pro & Specialty exams. + Second Chance. Retail $300.", url: v("aws-certified-machine-learning-specialty") },
  { code: "Networking", title: "AWS Advanced Networking – Specialty Exam Voucher", category: "Specialty", provider: "aws", image: img("aws-certified-advanced-networking-specialty"), blurb: "Pro & Specialty exams. Valid ≥9 months. Retail $300.", url: v("aws-certified-advanced-networking-specialty") },
];

export const microsoftVouchers: Voucher[] = [
  { code: "AZ-900", title: "Azure Fundamentals Exam Voucher", category: "Fundamentals", provider: "microsoft", image: img("microsoft-az-900"), blurb: "Save 10% (~$99 vs $99 retail varies by region). Valid ≥9 mo.", url: v("microsoft-az-900") },
  { code: "DP-900", title: "Azure Data Fundamentals Exam Voucher", category: "Fundamentals", provider: "microsoft", image: img("microsoft-dp-900"), blurb: "Save 10% on the exam. Valid ≥9 months. Pearson VUE.", url: v("microsoft-dp-900") },
  { code: "AZ-104", title: "Azure Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-az-104"), blurb: "Voucher + Retake Assurance. Valid ≥9 months. Retail ~$165.", url: v("microsoft-az-104") },
  { code: "AZ-500", title: "Azure Security Engineer Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-az-500"), blurb: "Voucher + Retake Assurance. Valid ≥9 months.", url: v("microsoft-az-500") },
  { code: "AI-102", title: "Azure AI Engineer Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-ai-102"), blurb: "Voucher + Retake Assurance. Valid ≥9 months.", url: v("microsoft-ai-102") },
  { code: "AZ-800", title: "Windows Server Hybrid Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-az-800"), blurb: "Voucher + Retake Assurance. Valid ≥9 months.", url: v("microsoft-az-800") },
  { code: "MD-102", title: "Endpoint Administrator Associate Exam Voucher", category: "Associate", provider: "microsoft", image: img("microsoft-md-102"), blurb: "Voucher + Retake Assurance. Valid ≥9 months.", url: v("microsoft-md-102") },
  { code: "AZ-305", title: "Azure Solutions Architect Expert Exam Voucher", category: "Expert", provider: "microsoft", image: img("microsoft-az-305"), blurb: "Voucher + Retake Assurance. Valid ≥9 months.", url: v("microsoft-az-305") },
];

export const allVouchers = [...comptiaVouchers, ...awsVouchers, ...microsoftVouchers];

export const providerMeta = {
  comptia: { name: "CompTIA", count: 15, color: "#C20D00", page: "/udemy-comptia-exam-vouchers", image: "/assets/images/vouchers/provider-comptia.svg", desc: "Security+ SY0-701, A+ Core 1 & 2, Network+ N10-009, CySA+, PenTest+, Linux+, CloudNetX, DataAI, SecurityX + 6 more." },
  aws: { name: "AWS", count: 12, color: "#FF9900", page: "/udemy-aws-exam-vouchers", image: "/assets/images/vouchers/provider-aws.svg", desc: "Cloud Practitioner CLF-C02, Solutions Architect SAA-C03, Developer, DevOps, Security & ML. Pearson VUE scheduling." },
  microsoft: { name: "Microsoft", count: 8, color: "#00A4EF", page: "/udemy-microsoft-exam-vouchers", image: "/assets/images/vouchers/provider-microsoft.svg", desc: "AZ-900, DP-900, AZ-104, AZ-500, AI-102, AZ-305, AZ-800, MD-102. Flat 10% off + Retake Assurance." },
};

export const comptiaGroupBlurbs: Record<string, string> = {
  "Core Certifications": "The entry-level trilogy employers ask for first. Start here with zero experience: Tech+ for absolute beginners, A+ for IT support roles, Network+ for networking fundamentals.",
  "Cybersecurity": "Mid- to senior-level security roles. Take these after Security+: CySA+ for SOC analysts, PenTest+ for penetration testers, SecurityX for security architects.",
  "Infrastructure & Cloud": "Servers, Linux, and cloud infrastructure for sysadmins and cloud engineers. Linux+ and Cloud+ appear most often in infrastructure job posts; CloudNetX and Server+ go deeper.",
  "Data & Project": "Data analytics, databases, and IT project management. Data+ and DataSys+ suit aspiring data analysts, DataAI covers the new AI/data intersection, Project+ suits IT project coordinators.",
};

export const awsGroupBlurbs: Record<string, string> = {
  "Foundational": "The zero-experience starting point. Cloud Practitioner CLF-C02 and AI Practitioner AIF-C01 need only 1-3 weeks of study and have no prerequisites.",
  "Associate": "The job-getter tier and the most requested AWS certs in job listings. Solutions Architect SAA-C03 is the flagship; Developer, Data Engineer, CloudOps, and ML Engineer go role-specific.",
  "Professional": "Advanced architect and DevOps roles for experienced practitioners. Take one of these after an Associate cert, not before.",
  "Specialty": "Deep specialist exams for experienced engineers. Security, Machine Learning, and Advanced Networking are among the highest-paid AWS certifications.",
};

export const microsoftGroupBlurbs: Record<string, string> = {
  "Fundamentals": "Your first Microsoft cert. AZ-900 Azure Fundamentals and DP-900 Data Fundamentals take 2-4 weeks of study with no prerequisites; AZ-900 carries the most weight with employers.",
  "Associate": "Role-based administrator and engineer certifications that form the core of most Azure job requirements: AZ-104, AZ-500, AI-102, AZ-800, and MD-102.",
  "Expert": "The capstone for Azure architects. AZ-305 Solutions Architect Expert expects prior Associate-level knowledge — take AZ-104 first.",
};
