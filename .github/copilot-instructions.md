# GitHub Copilot & AI Developer Instructions — World Top News

> **CRITICAL DIRECTIVES**:
> 1. NEVER commit or push anything to GitHub/git for any of the user's projects. All git commit/push operations are exclusively reserved for the user manually.
> 2. NEVER commit, push, or hardcode API keys or credentials. All API keys must strictly live in local `.env` files (which are git-ignored) and accessed via environment variables.

## Context & Architecture
You are working on **World Top News** (`raghuwanshi.kapil.WorldTopNews`), a cross-platform mobile news application designed for Android and Progressive Web App (PWA) hosting on Firebase (`worldtopnews-91916.firebaseapp.com`).

## Modern Technical Stack
- **Framework**: Ionic 8 + modern TypeScript web components
- **Native Runtime**: Capacitor 7 (targeting Android API Level 35)
- **News Provider**: NewsData.io (`https://newsdata.io/api/1/latest`)
  - Parameters: `country`, `category`, `language`, `apikey`, `qInTitle`, `page`
- **Native Plugins**:
  - `@capacitor/browser`: Open external full news articles in an in-app browser.
  - `@capacitor/share`: Native Android sharing sheet (WhatsApp, Twitter/X, SMS, etc.).
  - `@capacitor/preferences`: Local storage for saved/favorite news articles.
  - `@capacitor/network`: Online/offline connectivity detection.

## Core Directives & Standards
1. **Google Play Compliance**:
   - `targetSdkVersion` must always be `35`.
   - Never add broad or unneeded permissions (e.g. background location, contacts).
   - Ensure an in-app Privacy Policy link is available in the About/Profile screen.
2. **Design & UX**:
   - Follow Ionic 8 Material Design principles.
   - Support dark mode and high-contrast readable typography for news headlines.
   - Handle network dropouts gracefully with friendly retry states.
   - News images must have fallback placeholders for broken or missing URLs.
3. **Build & Release**:
   - Web distribution: `npm run build` -> `npx -y firebase-tools deploy --only hosting`.
   - Android distribution: `npx cap sync android` -> Build `.aab` in Android Studio.
