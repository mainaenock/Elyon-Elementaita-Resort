# Elyon Elementaita Resort

A luxury resort front-end with a short photographic homepage, responsive guest pages and a browser-local admin demo. Uses the supplied resort photographs and logo.

## Run locally

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3000
```

Open http://127.0.0.1:3000 and http://127.0.0.1:3000/admin.

## Stack

TypeScript, React, Next.js App Router APIs through **vinext** (Cloudflare's Vite-based implementation), and the Cloudflare Vite plugin. This is not the Vercel `next` compiler. The official Cloudflare starter configures a Worker-ready build. No account, database or media bucket has been provisioned.

Reference: [vinext setup and compatibility](https://github.com/cloudflare/vinext). Reassess current compatibility before production.

Fonts are bundled locally. Images are responsive WebP derivatives; originals remain untouched in the user's Downloads folder. `npm run images` regenerates them on the original development machine using the paths in `scripts/prepare-images.mjs`. Generated public assets are committed with the source, so other machines do not need those source files.

## Pages and interactions

- `/`: resort hero, date/guest search, compact experience collection and introduction.
- `/stays`: room search, guest capacity filtering, room details and sample prices.
- `/booking`: date/capacity validation, quote calculation and browser-local request reference.
- `/dining`, `/experiences`, `/events`: resort services and enquiry links.
- `/about`, `/team`: story, values and unfilled leadership profiles.
- `/gallery`: category/search filters, native accessible modal, previous/next and Escape dismissal.
- `/contact`: map search link, configurable contact details and local enquiry form.
- `/privacy`, `/terms`: accurate preview information, not final legal policies.
- `/admin`: booking status management, editable room rates, downloadable demo estimates, enquiries, media library and contact settings.

## Demo boundaries

Room categories, amenities and prices are illustrative. Bedroom photos, leadership names/portraits, history milestones and contact details await resort confirmation. Images on room cards are explicitly labelled as resort grounds.

Bookings, enquiries and edits use browser-local storage (`elyon-*` keys). They persist on the same browser/origin only. No messages are sent, no availability is checked, no payment is collected, and the admin has **no authentication**. Use fictional guest details. Clear this site's browser data to reset the demo. Do not expose this as a live operational system.

## GitHub Pages preview

GitHub Actions exports the frontend to `dist/client` and deploys it to GitHub Pages on pushes to `main`. The workflow gets the project's URL path from the Pages settings and uses it for routes and assets.

## Checks

```sh
npm run typecheck
npm run build
npm test
```

Tests expect the local server on port 3000 and Microsoft Edge installed. They cover route rendering/overflow at desktop and mobile widths, booking validation and persistence, admin status/rate edits, contact enquiries and gallery/menu keyboard flows.

`npm run build` produces Cloudflare Worker output in `.cloudflare/output`. `npm run deploy` requires a Cloudflare account and should only be used after production authentication and booking services are implemented. Dependencies are locked; overrides for `undici` and `fflate` apply patched versions to inherited dependencies.

See [implementation plan](docs/IMPLEMENTATION-PLAN.md) for the D1, R2, authentication, payment and launch phases, and [asset provenance](docs/ASSETS.md) for photo mappings.
