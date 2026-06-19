/**
 * Buyer-facing copy (trimmed for the prototype).
 * RULE: no wallet, gas, chain, bridge, swap, signature, seed phrase,
 * transaction hash, or USDm in default buyer UI. See full system at
 * /src/copy.ts in the repo root.
 */
export const copy = {
  signIn: {
    title: 'Sign in to complete checkout',
    body: 'Your details stay in one secure account, so next time is one tap.',
    legal: "By continuing you agree to Peptide Partners' terms. Your sign-in is protected by MOSS.",
    passkey: 'Continue with a passkey',
    passkeySub: 'Face ID / Touch ID — fastest',
    apple: 'Continue with Apple',
    google: 'Continue with Google',
    email: 'Continue with email',
    emailTitle: 'Sign in to your secure account',
    emailBody: "We'll email you a one-time code. No password needed.",
    sendCode: 'Send code',
    codeTitle: 'Enter your code',
    codeBody: 'We sent a 6-digit code to',
    resend: 'Resend code',
    expired: 'That code expired. Send a new one.',
    provisioning: 'Setting up your secure account…',
    provisioningSub: 'One moment — this only happens the first time.',
  },
  shipping: {
    title: 'Shipping details',
    save: 'Save my details securely for faster checkout next time.',
    cta: 'Continue to payment',
  },
  payment: {
    title: 'Payment',
    body: "Choose how you'd like to pay",
    divider: 'or pay another way',
    trust: 'Encrypted and protected by MOSS',
    more: 'More ways to pay',
    stablecoin: 'Pay with a stablecoin balance',
    stablecoinSub: 'Advanced · for buyers who already hold one',
    card: 'Credit or debit card',
    security: 'We never store your full card number.',
  },
  processing: {
    phase: ['Processing your payment…', 'Confirming your order…', 'Almost done…'],
    sub: 'Please keep this page open.',
  },
  confirmed: {
    title: 'Payment confirmed',
    detailsToggle: 'Payment details',
    continue: 'Continue shopping',
    status: 'View order status',
  },
  failed: {
    title: "Your payment didn't go through",
    body: 'No charge was made. Try another payment method to complete your order.',
    cta: 'Try another method',
  },
} as const;
