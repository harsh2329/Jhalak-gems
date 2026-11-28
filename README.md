# Jhalak Gems

Premium gemstone storefront built with Next.js 15, React 19, TypeScript, Prisma and PostgreSQL. Includes a responsive storefront, catalogue/search/filtering, interactive 3D demo viewer, persistent cart, database-backed admin catalogue and orders, and Razorpay checkout/webhook endpoints.

> **Launch status:** This is a deployable application codebase, not a configured live shop. You must supply the database, admin credentials, Razorpay merchant keys, real product information, store policies and domain. Demo gemstone records and their photos/models are illustrative placeholders and must not be sold as verified inventory.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- PostgreSQL database (Neon, Supabase or Render PostgreSQL)
- Razorpay merchant account for online payments (start in Test Mode)

## Local setup

```bash
cp .env.example .env.local
npm install
```

Fill `.env.local`:

- `DATABASE_URL`: PostgreSQL connection string.
- `ADMIN_EMAIL`: admin sign-in email.
- `ADMIN_PASSWORD`: long unique admin password.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters.
- `CRON_SECRET`: separate random secret used to protect expired-stock reservation cleanup.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay test keys initially.
- `RAZORPAY_WEBHOOK_SECRET`: webhook secret configured in Razorpay.

Generate a strong session secret, for example:

```bash
openssl rand -base64 48
```

Prepare the database and sample catalogue:

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Admin: `http://localhost:3000/admin`.

The seeded products are sample content. Replace names, images, prices, carat, origin, treatment and certification only with information confirmed by the store owner and physical product/certificates.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Store homepage and featured gemstones |
| `/shop` | Live catalogue, search, category/price filters and sorting |
| `/product/[slug]` | Product information and optional 3D demo viewer |
| `/cart` | Browser-persisted shopping cart |
| `/checkout` | Server-priced order creation and Razorpay checkout |
| `/admin` | Admin sign-in, product creation/archive, order overview |
| `GET /api/products` | Published products; demo fallback when no DB is configured |
| `POST /api/products` | Admin-only product creation |
| `PATCH/DELETE /api/products/:id` | Admin-only product update/archive |
| `POST /api/admin/login` | Admin session creation |
| `POST /api/admin/logout` | Admin session removal |
| `POST /api/checkout` | Server-side price/stock validation, stock decrement and Razorpay order creation |
| `POST /api/checkout/verify` | Verify Razorpay checkout signature |
| `POST /api/webhooks/razorpay` | Verify webhook signature and reconcile payment/order status |
| `GET /api/admin/orders` | Admin-only latest orders |
| `GET /api/cron/release-reservations` | Secret-protected expiry cleanup for unpaid stock reservations; scheduled by Vercel every five minutes |

## Razorpay webhook

Configure a webhook in the Razorpay dashboard with URL:

`https://YOUR_DOMAIN/api/webhooks/razorpay`

Subscribe to `payment.captured` and `payment.failed`. Set the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`. Test the entire payment and webhook lifecycle using Razorpay Test Mode before enabling live keys.

## Deployment

### Vercel (recommended for Next.js)

1. Push this project to the `main` branch of GitHub.
2. Import the repository into Vercel; use the Next.js preset and default build command `npm run build`.
3. Add every required environment variable from `.env.example` in Project Settings → Environment Variables.
4. Provision PostgreSQL, set `DATABASE_URL`, then run `npm run db:generate` and `npm run db:push` as part of the release/deployment workflow. Run `npm run db:seed` once if you want sample catalogue records.
5. Deploy, verify `/`, `/shop`, `/admin`, product APIs, test payment and webhook.

### Render

Create a Node web service with build command `npm install && npm run db:generate && npm run build` and start command `npm start`. Add a managed PostgreSQL database and the environment variables. Run `npm run db:push` and optional `npm run db:seed` once after setting the database connection. Use a persistent release/pre-deploy command for migrations if your Render plan supports it.

Netlify Next.js runtime support is available through the included Next plugin, but Vercel or Render is the simpler default for this server/API + Prisma application.

## Important operational notes

- Never commit `.env.local`, database URLs, Razorpay secrets or admin passwords.
- Use HTTPS and Razorpay live keys only after test transactions, webhook verification, stock reconciliation and owner approval.
- The current admin login uses a server-side environment credential and a signed, HTTP-only session cookie. Set a long unique password and rotate it if exposed. Add rate limiting/WAF protection before public production launch.
- Checkout creates a 15-minute stock reservation inside a database transaction. Captured payment converts the reservation into a sale; failed payment releases it. The Vercel cron endpoint releases abandoned reservations after expiry (set `CRON_SECRET`); configure an equivalent scheduled request if deploying elsewhere. Configure and test webhook delivery/retries before taking live orders. Monitor pending orders and reconcile them with Razorpay.
- Current product image URLs and GLB files are illustrative demo assets. Replace them with actual photographed items and real 3D scans/models. Do not imply demo models are scans of the physical gemstone.
- Confirm GST/tax treatment, shipping, insurance, cancellation, returns, refunds, privacy policy, terms and product claims with the business owner/qualified professionals before launch.
- The current implementation does not yet include customer accounts, password reset, automated shipping-provider integration, refunds UI, coupon management, file upload pipeline or inventory audit UI.

## Quality checks

```bash
npm run lint
npm run build
```

Run these after installing dependencies and configuring the environment. A successful build alone is not a substitute for checkout/webhook and inventory acceptance tests.
