# Cookie Consent Banner

## Overview

A bottom-bar cookie consent banner is displayed to first-time visitors, asking them to accept or decline the use of analytics cookies. The user's choice is persisted in `localStorage` so the banner does not reappear on subsequent visits.

## How it works

| Step | Description |
|------|-------------|
| First visit | `localStorage` has no `cookie_consent` key → banner is shown |
| User clicks **Kabul Et** | Key is set to `"accepted"` and a `cookie-consent-accepted` window event is dispatched |
| User clicks **Reddet** | Key is set to `"declined"` |
| Subsequent visits | Banner reads the stored value and stays hidden |

### Key: `cookie_consent`

Stored in `localStorage` with one of these values:

- `"accepted"` – user has consented to analytics cookies
- `"declined"` – user has declined

## Google Analytics integration

`GoogleAnalytics` (`components/analytics/google-analytics.tsx`) loads the GA4 scripts **only when consent is `"accepted"`**. It listens for the `cookie-consent-accepted` custom DOM event to activate GA in the same session without requiring a page reload.

## Where it lives

| File | Purpose |
|------|---------|
| `components/analytics/cookie-consent.tsx` | Banner component + `getConsentStatus` helper |
| `components/analytics/google-analytics.tsx` | GA4 loader, consent-aware |
| `app/layout.tsx` | Renders `<CookieConsentBanner />` inside the root layout |

## Configuration

No extra environment variables are needed for the banner itself.

To enable Google Analytics tracking (which requires consent), set the GA4 Measurement ID:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If this variable is absent, the GA component renders nothing regardless of consent status.

## Resetting consent (development / testing)

Open the browser DevTools console and run:

```js
localStorage.removeItem('cookie_consent')
location.reload()
```

The banner will appear again on the next page load.
