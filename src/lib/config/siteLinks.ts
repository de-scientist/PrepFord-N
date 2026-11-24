export const SITE_URL = (process.env.SKEW_LINE_APP_DOMAIN || "https://prepford.com").replace(/\/$/, "");

export interface SiteLink {
  name: string;
  description: string;
  href: string;
}

export const SITE_LINKS: SiteLink[] = [
  { name: "NCLEX-RN", description: "Realistic NCLEX-RN and Next Generation NCLEX-style questions with detailed rationales.", href: "/pages/exams/nclex-rn" },
  { name: "NCLEX-PN", description: "NCLEX-PN practice questions and licensure exam preparation for LPN/LVN candidates.", href: "/pages/exams/nclex-pn" },
  { name: "NCLEX-RN Dashboard", description: "Access your NCLEX-RN practice exams, performance analytics, and study hierarchy.", href: "/dashboards/nclex-rn" },
  { name: "NCLEX-PN Dashboard", description: "Access your NCLEX-PN practice exams, performance analytics, and study hierarchy.", href: "/dashboards/nclex-pn" },
  { name: "Study Programs", description: "Explore PrepFord NCLEX-RN and NCLEX-PN licensure preparation tracks.", href: "/pages/entrance" },
  { name: "About Us", description: "Learn about the team and mission behind the PrepFord NCLEX preparation platform.", href: "/pages/about-us" },
  { name: "FAQ", description: "Answers to common questions about NCLEX exams, subscriptions, and study resources.", href: "/pages/faqs" },
  { name: "Sign In", description: "Log in to your account to continue practicing and track your progress.", href: "/auth/login" },
  { name: "Register", description: "Create a free account and start practicing NCLEX-RN and NCLEX-PN exams today.", href: "/auth/register" },
];