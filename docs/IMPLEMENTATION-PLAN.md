# Elyon Elementaita Resort — implementation plan

## Phase 1: front end (this delivery)
- Short editorial homepage: photographic hero, date search, three experience cards, story invitation.
- Stays with searchable sample room categories, details, guest capacity and editable KES rates. Property photos are labelled where bedroom photography is pending.
- Dining, recreation/experiences and events pages using supplied photography.
- Searchable/filterable gallery with accessible image viewer.
- Our story and team pages; no invented biographies, opening dates or staff identities.
- Contact/enquiry flow, room/date/guest selection, calculated estimate and local booking request reference. No actual availability or payment claim.
- Browser-local demo admin: overview, reservation status management, room/rate editing, billing overview, media library and contact/content settings. Demo data is labelled and stays on this device.
- Forest/ivory/gold palette, restrained serif headings, responsive two-column cards on phones, keyboard navigation, reduced-motion support, optimized local WebP images.

## Phase 2: Cloudflare integration (after account access)
- Cloudflare Workers hosts the Next.js API-compatible App Router via vinext; re-evaluate its compatibility before production.
- D1 stores room inventory, seasonal rates, guests, reservations, enquiries, invoices, team and content. Enforce date-overlap checks and idempotent reservations in server-side transactions.
- R2 stores original media and derivatives; signed/admin-only uploads, MIME/size validation and delivery through a media domain or Cloudflare Images.
- Cloudflare Access or an application auth provider protects admin; enforce role authorization at every API. Roles: owner, reservations, finance, content. Audit all sensitive writes.
- Server-side validation, Turnstile on public submissions, rate limits, secrets outside source control, error monitoring, backups and retention controls.
- M-Pesa/payment provider integration uses server-created payment requests and verified, idempotent webhooks. Never infer paid status from the browser. Reconcile payments and refunds against invoices.
- Email confirmations and staff notifications after the resort supplies verified sender/contact details.

## Phase 3: launch
- Confirm spelling, exact location/map pin, contact channels, room inventory and photographs, rates/tax treatment, amenities, menu, leadership biographies and resort history.
- Approve cancellation, booking, privacy and payment policies before taking real bookings.
- Verify accessibility, 360/390/768/1440px layouts, keyboard flows, real booking concurrency, payment failures, admin permissions and restore procedures.
- Connect domain; configure production SEO, analytics/consent as appropriate and Search Console. Measure Core Web Vitals with production traffic.

## Scope boundary
The first delivery is a usable front-end prototype. Browser-local demo records are not a secure booking system, shared database, payment gateway or authenticated admin. Do not enter sensitive guest/payment information. Cloudflare provisioning and live payments wait for account access and approved commercial details.
