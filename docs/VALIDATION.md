# Validation — 30 September 2026

- `npm run typecheck`: passed.
- `npm run build`: passed; Cloudflare Worker production output generated.
- Dependency audit after compatible `undici` and `fflate` overrides: 0 known vulnerabilities.
- Browser coverage: all 13 routes rendered without JavaScript page errors or horizontal overflow at 360, 390, 768 and 1440px. Four viewport tests passed.
- Booking workflow: over-capacity request rejected; valid two-night family request calculates KES 29,000; local request appears in admin; status update persists after reload.
- Room/admin workflow: edited rate appears on the stays page; room search and empty state work; contact enquiry appears in admin.
- Gallery/mobile workflow: category filter, next image, Escape dismissal and mobile navigation passed.
- Visual review: desktop homepage composition, mobile homepage and two-column room cards reviewed in the browser.
- All 16 supplied assets converted to WebP with small responsive variants, totaling approximately 6.05 MB across the entire library. Images below the fold are lazy loaded; fonts are bundled locally.

The first test pass caught booking-grid overflow at 360px, which was corrected with constrained grid tracks and minimum widths. Interaction tests now wait for hydration before clicking server-rendered controls. An aggregate route-test timeout was resolved by separating each viewport into its own test.

Production build success is not a live deployment or production performance measurement. Cloudflare account provisioning, actual guest data, inventory concurrency, authentication, payment webhooks, email delivery and production Core Web Vitals remain untested until those services are connected.
