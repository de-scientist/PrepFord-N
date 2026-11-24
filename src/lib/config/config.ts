// frontend/src/lib/config/config.ts
// Centralized config using environment variables with fallbacks

// -----------------------------------------------------------------------------
// APP INFO
// -----------------------------------------------------------------------------
// SITE_HEADER_NAME preserves the environment-configured SKEW_LINE_APP_NAME for
// server-side BFF x-site-name header continuity without altering backend tenant headers.
export const SITE_HEADER_NAME = process.env.SKEW_LINE_APP_NAME || "PrepFord";
export const APP_NAME = "PrepFord";
export const APP_TITLE = "PrepFord";
export const APP_ACRONYM = "PF";
export const APP_DESCRIPTION =
  "A focused learning platform for NCLEX-RN and NCLEX-PN candidates, built with clinical accuracy and transparent assessment at its core.";
export const APP_VERSION = process.env.SKEW_LINE_APP_VERSION || "1.0.0";
export const APP_ENV = process.env.SKEW_LINE_APP_ENV || "live";
export const APP_DEBUG = process.env.SKEW_LINE_APP_DEBUG === "true";
export const APP_TIMEZONE = process.env.SKEW_LINE_APP_TIMEZONE || "UTC";
export const APP_LOCALE = process.env.SKEW_LINE_APP_LOCALE || "en";
export const APP_DOMAIN = process.env.SKEW_LINE_APP_DOMAIN || "http://localhost:3000";

// -----------------------------------------------------------------------------
// CONTACT & SOCIAL MEDIA
// -----------------------------------------------------------------------------
export const CONTACT = {
  AREA: process.env.SKEW_LINE_APP_AREA || "",
  ADDRESS: process.env.SKEW_LINE_APP_ADDRESS || "",
  TELLUNO: process.env.SKEW_LINE_APP_TELLUNO || "",
  PHONEUNO: process.env.SKEW_LINE_APP_PHONEUNO || "",
  TELTOS: process.env.SKEW_LINE_APP_TELTOS || "",
  PHONETOS: process.env.SKEW_LINE_APP_PHONETOS || "",
  EMAILUNO: process.env.SKEW_LINE_APP_EMAILUNO || "",
  EMAILTOS: process.env.SKEW_LINE_APP_EMAILTOS || "",
  WHATSAPP: process.env.SKEW_LINE_APP_WHATSAPP || "",
  INSTAGRAM: process.env.SKEW_LINE_APP_INSTAGRAM || "",
  FACEBOOK: process.env.SKEW_LINE_APP_FACEBOOK || "",
  TWITTER: process.env.SKEW_LINE_APP_TWITTER || "",
  LINKEDIN: process.env.SKEW_LINE_APP_LINKEDIN || "",
  TELEGRAM: process.env.SKEW_LINE_APP_TELEGRAM || "",
  TIKTOK: process.env.SKEW_LINE_APP_TIKTOK || "",
  REDDIT: process.env.SKEW_LINE_APP_REDDIT || "",
  YOUTUBE: process.env.SKEW_LINE_APP_YOUTUBE || "",
  PINTEREST: process.env.SKEW_LINE_APP_PINTEREST || "",
  CANONICALLINK: process.env.SKEW_LINE_APP_CANONICALLINK || "",
  DEVELOPER: process.env.SKEW_LINE_APP_DEVELOPER || "",
  DEVLINK: process.env.SKEW_LINE_APP_DEVLINK || "",
  SENDWHATSAPP: process.env.SKEW_LINE_APP_SENDWHATSAPP || "",
};

// -----------------------------------------------------------------------------
// EMAILS CONFIGURATION
// -----------------------------------------------------------------------------
export const EMAILS = {
  SUPPORT: process.env.SKEW_LINE_SUPPORT_EMAIL || "support@prepford.com",
  SYSTEM: process.env.SKEW_LINE_SYSTEM_EMAIL || "support@prepford.com",
  HELP: process.env.SKEW_LINE_HELP_EMAIL || "support@prepford.com",
};

// -----------------------------------------------------------------------------
// PHONE NUMBERS CONFIGURATION
// -----------------------------------------------------------------------------
export const PHONES = {
  TELL: process.env.SKEW_LINE_TELL_PHONE || "",
  SUPPORT: process.env.SKEW_LINE_SUPPORT_PHONE || "",
  HELP: process.env.SKEW_LINE_HELP_PHONE || "",
};

// -----------------------------------------------------------------------------
// BACKEND API CONFIGURATION (Active identifier only; URLs are server-only)
// -----------------------------------------------------------------------------
export const ACTIVE_BACKEND_TYPE = process.env.SKEW_LINE_ACTIVE_BACKEND || "dotnet";

// -----------------------------------------------------------------------------
// DEVELOPER INFO
// -----------------------------------------------------------------------------
export const DEVELOPER = {
  NAME: process.env.SKEW_LINE_DEVELOPER_NAME || "",
  PHONE: process.env.SKEW_LINE_DEVELOPER_PHONE || "",
  EMAIL: process.env.SKEW_LINE_DEVELOPER_EMAIL || "",
  WEBSITE: process.env.SKEW_LINE_DEVELOPER_WEBSITE || "",
  GITHUB: process.env.SKEW_LINE_DEVELOPER_GITHUB || "",
};

// -----------------------------------------------------------------------------
// SEO CONFIG
// -----------------------------------------------------------------------------
export const SEO = {
  author: DEVELOPER.NAME || "PrepFord Team",
  keywords: "PrepFord, NCLEX-RN, NCLEX-PN, Nursing Licensure Exam Preparation, Clinical Judgment, Practice Questions",
  ogImage: `${CONTACT.CANONICALLINK || "https://prepford.com"}/images/og-banner.jpg`,
  siteUrl: CONTACT.CANONICALLINK || "https://prepford.com",
};
