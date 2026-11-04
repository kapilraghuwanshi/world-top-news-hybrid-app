# World Top News (Android & PWA) — Agent Context & Architecture Guide

> [!CAUTION]
> **CRITICAL RULES FOR ALL AI AGENTS & TOOLS**:
> 1. **NEVER** run `git commit` or `git push` to GitHub or any remote repository for any of the user's projects. All version control operations (commit/push) are handled strictly by the user manually.
> 2. **NEVER** commit, push, or hardcode API keys, secrets, tokens, or credentials into source files. All keys must strictly reside in local `.env` files (which are `.gitignore`d) and referenced via environment variables (`import.meta.env.*` or `process.env.*`). Provide only `.env.example` templates with empty placeholders.

## 1. Project Overview & Identity
- **App Name**: World Top News
- **Android Package ID / Application ID**: `raghuwanshi.kapil.WorldTopNews`
- **Play Store URL**: [Google Play Link](https://play.google.com/store/apps/details?id=raghuwanshi.kapil.WorldTopNews)
- **Firebase Web Hosting (PWA)**: [Firebase Hosting](https://worldtopnews-91916.firebaseapp.com)
- **Primary Objective**: Provide real-time top headlines and category news across multiple languages and countries, with a responsive mobile-friendly web view and a native Android App Bundle (.aab) targeting Android API Level 35 for Google Play compliance.

---

## 2. Technology Stack & Modernization
- **Web Frontend**: Modern Ionic 8 (Mobile UI Web Components) + TypeScript
- **Native Runtime**: Capacitor 7 (replaces deprecated Cordova)
  - Seamless Android Studio integration (`/android` folder)
  - Java 21 & Gradle 8+ compatibility
- **Target Android Version**:
  - `compileSdkVersion`: **35** (Android 15)
  - `targetSdkVersion`: **35** (Android 15)
  - `minSdkVersion`: **24** (Android 7.0+)
- **System Requirements**: Node.js v20+ (tested on Node v25), Java 21, Android Studio (Ladybug / Meerkat / latest).

---

## 3. News Data Provider (NewsData.io)
- **Base Endpoint**: `https://newsdata.io/api/1/latest`
- **Authentication**: `apikey=<VITE_NEWSDATA_API_KEY>` (configured in `.env`)
- **Query Parameters**:
  - `country`: `in,us,gb,wo` (or filtered by selected country: `in`, `us`, etc.)
  - `language`: `en,hi,es,fr` (or filtered by user language selection)
  - `category`: `technology`, `sports`, `science`, `business`, `entertainment`, `top`, `health`
  - `page`: Pagination cursor (`nextPage` from response)
- **Article Data Schema**:
  ```typescript
  interface NewsArticle {
    article_id: string;
    title: string;
    description: string | null;
    link: string;
    image_url: string | null;
    pubDate: string;
    source_name: string;
    source_icon: string | null;
    category: string[];
    country: string[];
    language: string;
  }
  ```

---

## 4. Google Play Policy & Compliance Requirements
To guarantee zero policy strikes and instant Google Play approvals:
1. **Target API Level 34/35**: Always maintain `targetSdkVersion 35`.
2. **Privacy Policy Link**: An accessible in-app Privacy Policy link is mandatory in the About/Settings screen.
3. **Permissions Hygiene**:
   - `INTERNET` and `ACCESS_NETWORK_STATE` only.
   - Do NOT request `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` unless strictly required with an explicit runtime justification.
4. **Data Safety Declaration**:
   - App does not sell user data.
   - Bookmarks / favorites are stored locally on the device (`localStorage` / `@capacitor/preferences`).
5. **App Bundle (.aab)**: Always build release distributions as `.aab` (Android App Bundle), 64-bit compliant.

---

## 5. Development & Deployment Workflows

### Web / Firebase Hosting:
```bash
# 1. Install dependencies
npm install

# 2. Local preview
npm run dev

# 3. Build production web bundle (outputs to dist/ or www/)
npm run build

# 4. Deploy to Firebase Hosting
npx -y firebase-tools deploy --only hosting
```

### Android Native & Google Play:
```bash
# 1. Sync web assets into Android project
npx cap sync android

# 2. Open native project in Android Studio
npx cap open android

# 3. Build release App Bundle (.aab)
./gradlew bundleRelease
```
The resulting `.aab` is located in `android/app/build/outputs/bundle/release/app-release.aab`.
