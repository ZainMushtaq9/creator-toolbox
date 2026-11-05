# Monetization

## Order of priority

1. **Google AdSense — first.** Free tools + organic traffic + display ads.
   Status in Stage 1: placeholders only. `frontend/src/config/ads.js` has
   `enabled: false` and a placeholder publisher ID (`pub-YOUR-PUBLISHER-ID`).
   `public/ads.txt` contains the same placeholder and must be replaced with
   the exact line from your own AdSense account before deployment.
   No ad script is loaded while disabled. Ad slots render as labelled
   placeholders BELOW the main tool interaction, never above it and never
   styled like tool buttons.
2. **Affiliate — later.** Only for products genuinely relevant to creators.
   No affiliate links in Stage 1.
3. **Digital products — later.** Templates, presets, guides.
4. **Sponsored — later.** Clearly labelled, only if it does not compromise
   tool neutrality.
5. **Premium — much later, optional.** Core tools stay free; any premium
   tier would add convenience (sync, history) rather than lock core tools.

## AdSense approval — not guaranteed

Google reviews the whole site: original content, working tools, navigation,
privacy/terms/contact/about pages, HTTPS, no broken pages. Review can take
days to several weeks. Before applying: all 21 tools must work, every tool
page needs real explanatory content (not just a button and an input),
no placeholder domain/email may remain, and ads must not interfere with tools.

## What is NOT monetized in Stage 1

- No affiliate links, no paywalls, no paid tools, no subscriptions.
- GA4 is config-gated off (`frontend/src/config/analytics.js`).
- No tracking of tool inputs, file contents or email addresses — ever.
