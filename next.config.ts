// SkewLine\castoline\next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // ---------------------------------------------------------------------
    // GENERAL APP INFO
    // ---------------------------------------------------------------------
    SKEW_LINE_APP_NAME: process.env.SKEW_LINE_APP_NAME,
    SKEW_LINE_APP_TITLE: process.env.SKEW_LINE_APP_TITLE,
    SKEW_LINE_APP_ACRONNYM: process.env.SKEW_LINE_APP_ACRONNYM,
    SKEW_LINE_APP_DESCRIPTION: process.env.SKEW_LINE_APP_DESCRIPTION,
    SKEW_LINE_APP_VERSION: process.env.SKEW_LINE_APP_VERSION,
    SKEW_LINE_APP_ENV: process.env.SKEW_LINE_APP_ENV,
    SKEW_LINE_APP_DEBUG: process.env.SKEW_LINE_APP_DEBUG,
    SKEW_LINE_APP_TIMEZONE: process.env.SKEW_LINE_APP_TIMEZONE,
    SKEW_LINE_APP_LOCALE: process.env.SKEW_LINE_APP_LOCALE,
    SKEW_LINE_APP_DOMAIN: process.env.SKEW_LINE_APP_DOMAIN,

    // ---------------------------------------------------------------------
    // CONTACT & SOCIAL MEDIA
    // ---------------------------------------------------------------------
    SKEW_LINE_APP_AREA: process.env.SKEW_LINE_APP_AREA,
    SKEW_LINE_APP_ADDRESS: process.env.SKEW_LINE_APP_ADDRESS,
    SKEW_LINE_APP_TELLUNO: process.env.SKEW_LINE_APP_TELLUNO,
    SKEW_LINE_APP_PHONEUNO: process.env.SKEW_LINE_APP_PHONEUNO,
    SKEW_LINE_APP_TELTOS: process.env.SKEW_LINE_APP_TELTOS,
    SKEW_LINE_APP_PHONETOS: process.env.SKEW_LINE_APP_PHONETOS,
    SKEW_LINE_APP_EMAILUNO: process.env.SKEW_LINE_APP_EMAILUNO,
    SKEW_LINE_APP_EMAILTOS: process.env.SKEW_LINE_APP_EMAILTOS,
    SKEW_LINE_APP_WHATSAPP: process.env.SKEW_LINE_APP_WHATSAPP,
    SKEW_LINE_APP_INSTAGRAM: process.env.SKEW_LINE_APP_INSTAGRAM,
    SKEW_LINE_APP_FACEBOOK: process.env.SKEW_LINE_APP_FACEBOOK,
    SKEW_LINE_APP_TWITTER: process.env.SKEW_LINE_APP_TWITTER,
    SKEW_LINE_APP_LINKEDIN: process.env.SKEW_LINE_APP_LINKEDIN,
    SKEW_LINE_APP_TELEGRAM: process.env.SKEW_LINE_APP_TELEGRAM,
    SKEW_LINE_APP_TIKTOK: process.env.SKEW_LINE_APP_TIKTOK,
    SKEW_LINE_APP_REDDIT: process.env.SKEW_LINE_APP_REDDIT,
    SKEW_LINE_APP_YOUTUBE: process.env.SKEW_LINE_APP_YOUTUBE,
    SKEW_LINE_APP_PINTEREST: process.env.SKEW_LINE_APP_PINTEREST,
    SKEW_LINE_APP_CANONICALLINK: process.env.SKEW_LINE_APP_CANONICALLINK,
    SKEW_LINE_APP_DEVELOPER: process.env.SKEW_LINE_APP_DEVELOPER,
    SKEW_LINE_APP_DEVLINK: process.env.SKEW_LINE_APP_DEVLINK,
    SKEW_LINE_APP_SENDWHATSAPP: process.env.SKEW_LINE_APP_SENDWHATSAPP,

    // ---------------------------------------------------------------------
    // EMAILS CONFIGURATION
    // ---------------------------------------------------------------------
    SKEW_LINE_SUPPORT_EMAIL: process.env.SKEW_LINE_SUPPORT_EMAIL,
    SKEW_LINE_SYSTEM_EMAIL: process.env.SKEW_LINE_SYSTEM_EMAIL,
    SKEW_LINE_HELP_EMAIL: process.env.SKEW_LINE_HELP_EMAIL,

    // ---------------------------------------------------------------------
    // PHONE NUMBERS CONFIGURATION
    // ---------------------------------------------------------------------
    SKEW_LINE_TELL_PHONE: process.env.SKEW_LINE_TELL_PHONE,
    SKEW_LINE_SUPPORT_PHONE: process.env.SKEW_LINE_SUPPORT_PHONE,
    SKEW_LINE_HELP_PHONE: process.env.SKEW_LINE_HELP_PHONE,

    // ---------------------------------------------------------------------
    // BACKEND API CONFIGURATION
    // ---------------------------------------------------------------------
    SKEW_LINE_ACTIVE_BACKEND: process.env.SKEW_LINE_ACTIVE_BACKEND,
    SKEW_LINE_LARAVEL_BASE_URL: process.env.SKEW_LINE_LARAVEL_BASE_URL,
    SKEW_LINE_FASTAPI_BASE_URL: process.env.SKEW_LINE_FASTAPI_BASE_URL,
    SKEW_LINE_DOTNET_BASE_URL: process.env.SKEW_LINE_DOTNET_BASE_URL,

    // ---------------------------------------------------------------------
    // DEVELOPER INFO
    // ---------------------------------------------------------------------
    SKEW_LINE_DEVELOPER_NAME: process.env.SKEW_LINE_DEVELOPER_NAME,
    SKEW_LINE_DEVELOPER_PHONE: process.env.SKEW_LINE_DEVELOPER_PHONE,
    SKEW_LINE_DEVELOPER_EMAIL: process.env.SKEW_LINE_DEVELOPER_EMAIL,
    SKEW_LINE_DEVELOPER_WEBSITE: process.env.SKEW_LINE_DEVELOPER_WEBSITE,
    SKEW_LINE_DEVELOPER_GITHUB: process.env.SKEW_LINE_DEVELOPER_GITHUB,

    // ---------------------------------------------------------------------
    // AUTH / OAUTH
    // ---------------------------------------------------------------------
    SKEW_LINE_GOOGLE_CLIENT_ID: process.env.SKEW_LINE_GOOGLE_CLIENT_ID,

    // ---------------------------------------------------------------------
    // DASHBOARD REDIRECT URLS
    // ---------------------------------------------------------------------
    SKEW_LINE_NCLEX_RN_URL: process.env.SKEW_LINE_NCLEX_RN_URL,
    SKEW_LINE_NCLEX_PN_URL: process.env.SKEW_LINE_NCLEX_PN_URL,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;