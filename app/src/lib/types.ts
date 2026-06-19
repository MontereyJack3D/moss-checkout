/**
 * Shared domain types for the MOSS Checkout prototype.
 *
 * The buyer never sees crypto vocabulary. Settlement concepts (PYUSD,
 * settling/settled) live on the PaymentIntent and are only surfaced in the
 * demo-only "Payment details" reveal and the Partner dashboard.
 */

/** Model B: checkout payment intent / escrow lifecycle. */
export type PaymentStatus =
  | 'awaiting_login' // buyer needs to sign in
  | 'awaiting_passkey' // new account: one-time MOSS passkey setup (the only web3 touch)
  | 'awaiting_customer_info' // buyer needs to add shipping/contact
  | 'awaiting_payment' // buyer needs to choose a payment method
  | 'processing_payment' // funding in progress
  | 'paid' // buyer's payment captured
  | 'settling' // merchant settlement in progress (PYUSD)
  | 'settled' // merchant has received PYUSD
  | 'failed'; // payment did not go through (buyer held harmless)

export type SignInProvider = 'email' | 'google' | 'apple' | 'passkey';

export type PaymentMethod = 'apple_pay' | 'google_pay' | 'card' | 'paypal' | 'stablecoin';

export type SettlementAsset = 'USDm';

export interface Product {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  researchOnly: boolean;
  stock: number;
  badge?: string;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

/** A buyer-facing account, created/retrieved invisibly by MOSS. */
export interface SecureAccount {
  id: string;
  email: string;
  returning: boolean;
}

export interface PaymentIntent {
  id: string;
  orderNumber: string;
  amount: number; // what the buyer pays
  currency: 'USD';
  status: PaymentStatus;
  method?: PaymentMethod;
  /** Demo-only settlement detail — never shown in default buyer UI. */
  settlementAsset: SettlementAsset;
  merchantReceives: number; // PYUSD amount the merchant settles in
  reference: string; // opaque "payment reference" (NOT a hash)
  createdAt: string;
}

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  card: 'Card',
  paypal: 'PayPal',
  stablecoin: 'Stablecoin balance',
};
