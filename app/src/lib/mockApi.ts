/**
 * Mocked payment/settlement API. No backend required.
 *
 * Simulates the MOSS payment-intent (Model B) lifecycle with realistic
 * latency so the UI can exercise every PaymentStatus. All "settlement"
 * (PYUSD) detail is computed here and only revealed in demo surfaces.
 */
import type {
  CustomerInfo,
  PaymentIntent,
  PaymentMethod,
  SecureAccount,
  SignInProvider,
} from './types';
import { makeOrderNumber, makeReference } from './format';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * "Known" returning buyers for the demo. Returning accounts skip the one-time
 * MOSS passkey setup. The default buyer (chris@) is treated as NEW so the
 * passkey step is shown; use returning@example.com to demo the returning path.
 */
const RETURNING = new Set(['returning@example.com']);

/**
 * Create or retrieve a hidden MOSS secure account. Framed to the buyer as
 * "sign in" — never wallet creation.
 */
export async function signIn(
  provider: SignInProvider,
  email = 'chris@example.com',
): Promise<SecureAccount> {
  await delay(provider === 'passkey' ? 500 : 850);
  return {
    id: 'acct_' + Math.random().toString(36).slice(2, 10),
    email,
    returning: RETURNING.has(email.toLowerCase()),
  };
}

/** Email one-time-code flow. `000000` simulates an expired code. */
export async function verifyEmailCode(code: string): Promise<{ ok: boolean; reason?: string }> {
  await delay(450);
  if (code === '000000') return { ok: false, reason: 'expired' };
  if (code.length < 6) return { ok: false, reason: 'incomplete' };
  return { ok: true };
}

/** Open a payment intent for the order total. Status starts awaiting_payment. */
export async function createIntent(amount: number): Promise<PaymentIntent> {
  await delay(300);
  return {
    id: 'pi_' + Math.random().toString(36).slice(2, 12),
    orderNumber: makeOrderNumber(),
    amount,
    currency: 'USD',
    status: 'awaiting_payment',
    settlementAsset: 'USDm',
    // Merchant settles 1:1 in USDm for the demo (orchestration is invisible).
    merchantReceives: amount,
    reference: makeReference(),
    createdAt: new Date().toISOString(),
  };
}

export interface PayOptions {
  /** Demo toggle: force a declined payment. */
  simulateDecline?: boolean;
}

/**
 * Submit payment. Resolves to `paid` or `failed`. The buyer is always held
 * harmless on failure (no charge).
 */
export async function submitPayment(
  method: PaymentMethod,
  opts: PayOptions = {},
): Promise<'paid' | 'failed'> {
  await delay(1600); // processing_payment window
  return opts.simulateDecline ? 'failed' : 'paid';
}

/**
 * Drive the merchant-side settlement after a successful payment:
 * paid -> settling -> settled. Invokes `onStatus` as it progresses.
 * Returns a cancel function.
 */
export function runSettlement(onStatus: (s: 'settling' | 'settled') => void): () => void {
  const t1 = setTimeout(() => onStatus('settling'), 1200);
  const t2 = setTimeout(() => onStatus('settled'), 3400);
  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };
}

/** Persist customer info (no-op mock). */
export async function saveCustomerInfo(info: CustomerInfo): Promise<void> {
  await delay(300);
  void info;
}
