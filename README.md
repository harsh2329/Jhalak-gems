# Jhalak Gems — Website starter

A premium gemstone e-commerce starter for Jhalak Gems, Chandkheda, Ahmedabad.

## Included in this starter

- Premium emerald/charcoal/champagne visual direction
- Responsive storefront and product catalogue
- Search, category and price filtering
- Product detail route
- Browser-side demo cart (localStorage)
- Admin inventory screen with demo product CRUD
- Product SKU, carat, shape, treatment, origin and certificate fields
- CSS gemstone hero visual
- Interactive product-page 3D viewer using Google `<model-viewer>`
- Three locally bundled faceted GLB demonstration gemstone models (emerald, sapphire, ruby)
- Prisma/PostgreSQL data model for users, roles, products, inventory, orders, payments, shipments, certificates and audit logs
- Server-side checkout and Razorpay webhook scaffolding with explicit configuration guards

## Important status

This is a **development starter / functional UI prototype**, not a live store. The newly added 3D models are generic demonstration meshes, not photogrammetry scans of Jhalak Gems inventory. Replace each model URL with a model captured from the actual physical stone before representing it as an exact product preview. The sample products and prices are illustrative. Cart and admin changes in the current UI are demo/local browser state. Real authentication, persistent admin CRUD, shipping labels, email/WhatsApp notifications, certificate storage and live payment processing must be connected and tested before launch.

Do not accept real payments until merchant onboarding, legal policies, inventory reconciliation, webhook verification and end-to-end testing are complete.

## Run locally

1. Install Node.js 20.9+.
2. Extract this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Configure a PostgreSQL database and `DATABASE_URL`.
6. Run `npx prisma generate`.
7. Run `npx prisma migrate dev --name init`.
8. Run `npm run dev`.
9. Open `http://localhost:3000`.

## Netlify deployment starter

A `netlify.toml` is included for the Next.js build using the Netlify Next.js adapter. This repository still needs a Git remote, a connected Netlify site, environment variables, and a successful production build before a public deployment can be verified.

## 3D viewer

The product page loads the `@google/model-viewer` web component and local GLB files from `public/models/`. Visitors can rotate and zoom the demonstration model. The model viewer is not a substitute for a real stone scan; upload a product-specific GLB/GLTF to the media storage and set that product’s `model3d` URL.

## Recommended next implementation steps

1. Implement authentication and role-based access control (admin/manager/staff/customer).
2. Replace demo catalogue with Prisma-backed product APIs.
3. Persist inventory and use database transactions/locking for unique stones.
4. Implement Razorpay order creation and signature verification.
5. Verify Razorpay webhook signatures and make webhook processing idempotent.
6. Add Cloudinary/S3 uploads with server-side file validation.
7. Add Shiprocket integration after account approval.
8. Add customer account, address book, order history, returns and refunds.
9. Add consent-based email/WhatsApp notifications.
10. Complete tax, invoice, privacy, shipping and returns policies with the business/CA.
11. Test accessibility, mobile performance, security and full checkout on staging.
12. Deploy only after owner approval and a successful test purchase.

## Brand and business details still required

- Approved logo and brand assets
- Real gemstone inventory, actual product photos and certificates
- Final product categories and attribute conventions
- Pricing policy: fixed price, enquiry-only or hybrid
- Store phone, email, business hours and exact address
- Shipping coverage, insurance and delivery policy
- Cancellation, return and refund policy
- GST/tax and invoice requirements confirmed by the business/CA
- Razorpay and shipping-provider merchant accounts

## Folder map

- `src/app`: pages, API routes and global styles
- `src/components`: storefront components
- `src/lib`: demo data and helpers
- `prisma/schema.prisma`: relational data model
