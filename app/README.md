# MOSS Checkout — Prototype

A clickable demo of **MOSS Checkout** wrapped around the **Peptide Partners** storefront.
Buyers experience a normal, premium Web2 checkout; merchants settle in **USDm**. No backend —
everything is mocked.

**🔗 Live:** https://moss-checkout.vercel.app

> **Copy rule:** the default buyer UI never says wallet, gas, chain, bridge, swap, signature,
> seed phrase, transaction hash, or USDm. Settlement detail (USDm) only appears in the
> demo-only **"Payment details → Show settlement details"** reveal and the partner side.

## What's in the deploy

One Vercel deployment serves both sides:

| Route | What it is |
| --- | --- |
| `/` | Buyer storefront + checkout (Vite SPA) |
| `/cart`, `/product/:slug`, `/dashboard` | Buyer SPA routes (deep links work via rewrite) |
| `/partner.html` | Full merchant: **register → onboard → dashboard** (static, self-contained) |

## The one-time MOSS passkey (the only web3 touch)

Both buyers and merchants sign a **MOSS passkey exactly once**, when their account is created.
It's framed as ordinary biometric security (Face ID / Touch ID) and is the *only* moment anything
"crypto/web3" happens — it provisions the account on-chain in the background. After that, everything
is tap-and-pay (buyers) or a normal payments dashboard (merchants). A small demo-only reveal explains
what's happening under the hood. Returning accounts never see the step again.

## Stack

- **Vite + React 18 + TypeScript** + **Tailwind CSS** for the buyer app (`src/`)
- `react-router-dom` for storefront / product / cart / dashboard routes
- The merchant app ships as a self-contained `public/partner.html` (React + Tailwind via CDN)
- Mocked API + local React context state (no server)

## Run locally

```bash
cd app
npm install
npm run dev        # http://localhost:5173  (buyer app; /partner.html for merchant)
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Demo flows

### 1. Buyer — happy path (→ USDm settlement)
1. Storefront `/` → open a product → **Add to bag** → `/cart`.
2. **Checkout** opens the hosted overlay.
3. **Sign in** (passkey / Apple / Google / email code) — a hidden MOSS secure account is created.
4. **Set up your secure account** — tap **Create passkey**, confirm the Face ID sheet (the one web3 step).
5. **Shipping details** + "Save my details securely…" → **Continue to payment**.
6. **Pay** — Apple Pay / Google Pay / Card / PayPal / advanced stablecoin.
7. **Processing** → **Payment confirmed** with order number + receipt.
8. Open **Payment details** → toggle **Show settlement details (DEMO ONLY)** to see USDm settling.
9. **View order status** → `/dashboard`: your order shows **LIVE** and settles
   **Confirmed → Settling → Settled**, with the merchant receiving USDm.

### 2. Merchant — `/partner.html`
**Create account** → **Sign with your MOSS passkey** (one-time on-chain activation) →
onboarding wizard (business → products → payments → settlement in USDm → payout → preview → go live)
→ dashboard (orders, payouts, settlement config with the verify-destination flow).

### 3. Edge cases
- **Declined payment:** in Payment → Card, tick **"Simulate a declined payment"** → held-harmless error + retry.
- **Expired sign-in code:** enter **`000000`** on the email code screen.
- **Returning buyer:** sign in with `returning@example.com` to skip the passkey step.

## Payment-intent state machine (Model B)

`awaiting_login → awaiting_passkey → awaiting_customer_info → awaiting_payment → processing_payment → paid → settling → settled`
(with `failed` as the held-harmless branch off `processing_payment`).

Defined in `src/lib/types.ts`, driven by `src/state/CheckoutContext.tsx` + `src/lib/mockApi.ts`.
The buyer UI maps these to friendly, crypto-free language; `settling`/`settled` are merchant-only.

## Project structure

```
app/
├─ index.html · vite.config.ts · tailwind.config.js · vercel.json · tsconfig.json
├─ public/
│  └─ partner.html            # full merchant register → onboard → dashboard
└─ src/
   ├─ main.tsx · App.tsx · index.css
   ├─ data/      mockData.ts (products/merchant)  ·  copy.ts (crypto-free buyer copy)
   ├─ lib/       types.ts (PaymentStatus machine) · mockApi.ts · format.ts
   ├─ state/     CartContext.tsx · CheckoutContext.tsx
   ├─ components/
   │  ├─ ui.tsx · icons.tsx · storefront.tsx
   │  ├─ checkout/ CheckoutOverlay · steps · PasskeyStep · PaymentDetails
   │  └─ dashboard/ DashboardPreview
   └─ pages/     Storefront · Product · Cart · Dashboard
```

Standalone single-file demos (no server, double-click to open) live in the repo root:
`standalone/peptide-partners-demo.html` (buyer) and `merchant-dashboard/index.html` (merchant).

## Deploy

The app is deployed to Vercel as project **`moss-checkout`**.

**Manual deploy (from `app/`):**
```bash
cd app
vercel --prod
```

**Auto-deploy (Git):** the repo is connected at
`https://github.com/MontereyJack3D/moss-checkout`. To enable push-to-deploy, connect the repo in
**Vercel → Project → Settings → Git** (requires the Vercel GitHub app to have access to the repo).
Once connected, every push to `main` deploys to production and PRs get preview URLs. If a Git build
fails, set **Root Directory = `app`** in the project's Build & Deployment settings.

## Notes

- Settlement is mocked 1:1 (buyer USD → merchant USDm) for clarity; swap in real rates in
  `mockApi.createIntent`.
- Refunds are intentionally out of scope for v1.
- To wire a real backend, replace the functions in `src/lib/mockApi.ts` — the UI and state
  machine stay unchanged.
