# MOSS Checkout — Frontend Prototype

A clickable demo of **MOSS Checkout** wrapped around the **Peptide Partners** storefront.
Buyers experience a normal, premium Web2 checkout; merchants settle in **PYUSD**. No backend —
everything is mocked.

> **Copy rule:** the default buyer UI never says wallet, gas, chain, bridge, swap, signature,
> seed phrase, transaction hash, or USDm. Settlement detail (PYUSD) only appears in the
> demo-only **"Payment details → Show settlement details"** reveal and the Partner dashboard.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS**
- **react-router-dom** for storefront / product / cart / dashboard routes
- Mocked API + local React context state (no server)

## Run it

```bash
cd app
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Demo flows

### 1. Happy path (buyer → merchant settlement)
1. Storefront `/` → open a product → **Add to bag** → land on `/cart`.
2. **Checkout** opens the hosted overlay.
3. **Sign in** — pick **passkey / Apple / Google** (one tap) or **email** (passwordless code).
   A hidden MOSS secure account is created/retrieved — framed only as "sign in."
4. **Shipping details** + "Save my details securely…" → **Continue to payment**.
5. **Payment** — tap **Apple Pay / Google Pay**, or expand **Card**, or **PayPal**, or
   **More ways to pay → stablecoin balance**.
6. **Processing** → **Payment confirmed** with order number + receipt.
7. Open **Payment details** for buyer-safe info; toggle **Show settlement details (DEMO ONLY)**
   to reveal the behind-the-scenes PYUSD settlement.
8. Click **View order status** → **Partner dashboard** (`/dashboard`). Your order shows as
   **LIVE** and you can watch settlement go **Confirmed → Settling → Settled**, with the
   merchant receiving PYUSD.

### 2. Declined payment (error state)
In **Payment → Card**, tick **"Simulate a declined payment"** then pay. You'll see the
held-harmless error ("No charge was made…") and can retry with another method.

### 3. Expired sign-in code
On the email code screen, enter **`000000`** to trigger the expired-code error + resend.

### 4. Returning buyer
Signing in with `chris@example.com` or `returning@example.com` is treated as a returning
secure account (see `src/lib/mockApi.ts`).

## Payment-intent state machine (Model B)

`awaiting_login → awaiting_customer_info → awaiting_payment → processing_payment → paid → settling → settled`
(with `failed` as the held-harmless branch off `processing_payment`).

Defined in `src/lib/types.ts`, driven by `src/state/CheckoutContext.tsx` + `src/lib/mockApi.ts`.
The buyer UI maps these to friendly, crypto-free language; `settling`/`settled` are only
surfaced to the merchant.

## Project structure

```
app/
├─ index.html
├─ vite.config.ts · tailwind.config.js · postcss.config.js · tsconfig*.json
└─ src/
   ├─ main.tsx                # entry + router
   ├─ App.tsx                 # providers + routes + checkout overlay
   ├─ index.css               # Tailwind + base styles
   ├─ data/
   │  ├─ mockData.ts          # products, merchant, seed orders  ← mock data file
   │  └─ copy.ts              # buyer-facing copy (crypto-free)
   ├─ lib/
   │  ├─ types.ts             # domain types + PaymentStatus machine
   │  ├─ mockApi.ts           # simulated payment/settlement API
   │  └─ format.ts            # money / pyusd / id helpers
   ├─ state/
   │  ├─ CartContext.tsx      # cart + totals
   │  └─ CheckoutContext.tsx  # checkout state machine
   ├─ components/
   │  ├─ ui.tsx · icons.tsx
   │  ├─ storefront.tsx       # header + product card
   │  ├─ checkout/
   │  │  ├─ CheckoutOverlay.tsx
   │  │  ├─ steps.tsx         # SignIn / Shipping / Payment / Processing / Confirmation
   │  │  └─ PaymentDetails.tsx# expandable details + demo settlement reveal
   │  └─ dashboard/DashboardPreview.tsx
   └─ pages/
      ├─ StorefrontPage.tsx · ProductPage.tsx · CartPage.tsx · DashboardPage.tsx
```

## Notes & next steps

- Settlement is mocked 1:1 (buyer USD → merchant PYUSD) for clarity; swap in real rates in
  `mockApi.createIntent`.
- Refunds are intentionally out of scope for v1.
- To wire a real backend, replace the functions in `src/lib/mockApi.ts` — the UI and state
  machine stay unchanged.
