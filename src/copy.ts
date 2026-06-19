/**
 * MOSS Checkout — Buyer-facing copy system (single source of truth)
 * ------------------------------------------------------------------
 * Premium, Web2-feeling checkout copy. The buyer never sees crypto.
 *
 * Conventions
 *  - `primary`   → ship this by default
 *  - `alt`       → A/B variants or tone shifts (same meaning, buyer-safe)
 *  - `micro`     → tooltips, helper text, validation, inline hints
 *  - Tokens like {total}, {email}, {firstName}, {method}, {merchant},
 *    {order}, {last4}, {field}, {n}, {ref} are filled via `t()` / `fill()`.
 *
 * RULE: nothing here may say wallet, gas, chain, bridge, swap, signature,
 * seed phrase, transaction hash, or USDm. See BANNED + REPLACEMENTS below;
 * `assertBuyerSafe()` enforces it in dev/tests.
 */

/* ------------------------------------------------------------------ */
/* Tokens & interpolation                                              */
/* ------------------------------------------------------------------ */

export type CopyToken =
  | 'total'
  | 'email'
  | 'firstName'
  | 'method'
  | 'merchant'
  | 'order'
  | 'last4'
  | 'field'
  | 'n'
  | 'ref'
  | 'maskedEmail';

export type CopyVars = Partial<Record<CopyToken, string | number>>;

/** Fill {tokens} in a single string. Unmatched tokens are left intact. */
export function fill(template: string, vars: CopyVars = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) =>
    key in vars ? String(vars[key as CopyToken]) : m
  );
}

/* ------------------------------------------------------------------ */
/* Copy shape                                                          */
/* ------------------------------------------------------------------ */

export interface CopyBlock {
  /** Default, shippable copy. Strings or token templates. */
  primary: Record<string, string>;
  /** Alternate variants keyed by the same logical slot (arrays = options). */
  alt?: Record<string, string[]>;
  /** Tooltips, helper text, validation, inline hints. */
  micro?: Record<string, string>;
}

export type CopySystem = Record<string, CopyBlock>;

/* ================================================================== */
/* THE COPY                                                            */
/* ================================================================== */

export const copy = {
  /* 1. Checkout header ------------------------------------------------ */
  header: {
    primary: {
      title: 'Checkout',
      trust: 'Secure checkout',
      footer: 'Secured by MOSS',
    },
    alt: {
      title: ['Complete your order', 'Pay securely', '{merchant} checkout'],
      footer: ['Payments protected by MOSS', 'Encrypted & secure'],
    },
    micro: {
      lockTooltip: 'Your details are encrypted end to end.',
    },
  },

  /* 2. Cart review --------------------------------------------------- */
  cart: {
    primary: {
      title: 'Your bag',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      cta: 'Checkout · {total}',
    },
    alt: {
      title: ['Order summary', 'Your order', 'Review your bag'],
      cta: ['Continue to checkout', 'Pay {total}'],
    },
    micro: {
      edit: 'Edit bag',
      qty: 'Qty {n}',
      reassurance: "You won't be charged until you confirm.",
    },
  },

  /* 3. Sign-in chooser ----------------------------------------------- */
  signIn: {
    primary: {
      title: 'Sign in to complete checkout',
      body: 'Your details stay in one secure account, so next time is one tap.',
    },
    alt: {
      title: ['Almost there — sign in to pay', 'Sign in to continue'],
      body: [
        'Sign in once. Check out faster every time after.',
        'One secure account for a faster checkout.',
      ],
    },
    micro: {
      legal:
        "By continuing you agree to {merchant}'s terms. Your sign-in is protected by MOSS.",
      whyTooltip:
        'Signing in keeps your saved details secure and speeds up future orders.',
    },
  },

  /* 4. Email sign-in ------------------------------------------------- */
  emailSignIn: {
    primary: {
      fieldLabel: 'Email',
      cta: 'Send code',
      codeTitle: 'Enter your code',
      codeBody: 'We sent a 6-digit code to {email}.',
      codeCta: 'Continue',
      resend: "Didn't get it? Resend code",
    },
    alt: {
      cta: ['Email me a code', 'Continue with email'],
      codeBody: ['Check your inbox for a 6-digit code.'],
    },
    micro: {
      helper: "No password needed — we'll email you a one-time code.",
      resendCooldown: 'You can resend in {n}s',
    },
  },

  /* 5. Social sign-in ------------------------------------------------ */
  socialSignIn: {
    primary: {
      apple: 'Continue with Apple',
      google: 'Continue with Google',
    },
    alt: {
      apple: ['Sign in with Apple', 'Use Apple to continue'],
      google: ['Sign in with Google', 'Use Google to continue'],
    },
    micro: {
      helper: "We'll only use this to sign you in securely.",
    },
  },

  /* 6. Passkey sign-in ----------------------------------------------- */
  /* NOTE: secure sign-in framing ONLY. Never "set up", "create",       */
  /* "recovery", or anything implying key/wallet generation.            */
  passkey: {
    primary: {
      label: 'Continue with a passkey',
      sub: 'Face ID / Touch ID — fastest',
    },
    alt: {
      label: ['Sign in with Face ID / Touch ID', 'Use a passkey'],
      sub: ['The fastest, most secure way to sign in'],
    },
    micro: {
      tooltip:
        'A passkey lets you sign in with your face, fingerprint, or device PIN — nothing to remember.',
    },
  },

  /* 7. Returning user ------------------------------------------------ */
  returning: {
    primary: {
      greeting: 'Welcome back, {firstName}',
      body: 'Pay in one tap with your saved details.',
      expressCta: 'Pay {total} · {method}',
      secondary: 'Use a different method',
    },
    alt: {
      greeting: ['Good to see you, {firstName}'],
      body: ["Everything's ready — just confirm."],
      switchAccount: ['Not you? Sign in'],
    },
    micro: {
      savedBadge: 'Saved checkout details',
      maskedIdentity: 'Signed in as {maskedEmail}',
    },
  },

  /* 8. Shipping / contact form --------------------------------------- */
  shipping: {
    primary: {
      title: 'Shipping details',
      fullName: 'Full name',
      address: 'Address',
      city: 'City',
      state: 'State',
      zip: 'ZIP',
      phone: 'Phone (optional)',
      cta: 'Continue to payment',
    },
    alt: {
      title: ['Where should we send it?', 'Delivery details'],
      cta: ['Continue', 'Save & continue'],
    },
    micro: {
      signedInAs: 'Signed in as {email}',
      phoneHelper: 'For delivery updates only.',
      validationMissing: 'Please add your {field}.',
      validationZip: "That ZIP doesn't look right.",
      autofillHint: "We'll use your saved address.",
    },
  },

  /* 9. Save checkout details checkbox -------------------------------- */
  saveDetails: {
    primary: {
      label: 'Save my details securely for faster checkout next time.',
    },
    alt: {
      label: [
        'Remember my details for next time.',
        'Save securely for one-tap checkout.',
      ],
    },
    micro: {
      tooltip:
        'Your saved details are encrypted and only used to speed up your checkout.',
      uncheckedHelper: "We'll only use these details for this order.",
    },
  },

  /* 10. Payment section ---------------------------------------------- */
  payment: {
    primary: {
      title: 'Payment',
      body: "Choose how you'd like to pay {total}.",
      divider: 'or pay another way',
      trust: 'Encrypted and protected by MOSS',
    },
    alt: {
      title: ['How would you like to pay?', 'Payment method'],
      divider: ['more options below'],
    },
    micro: {
      security: 'We never store your full card number.',
    },
  },

  /* 11. Apple Pay / Google Pay / Card / PayPal ----------------------- */
  methods: {
    primary: {
      applePay: 'Pay', // shown with Apple Pay mark
      googlePay: 'Pay', // shown with Google Pay mark
      card: 'Credit or debit card',
      cardNumber: 'Card number',
      cardExpiry: 'Expiry',
      cardCvc: 'CVC',
      cardCta: 'Pay {total}',
      paypal: 'PayPal',
    },
    alt: {
      card: ['Pay by card', 'Debit or credit card'],
      cardCta: ['Pay securely', 'Confirm payment'],
    },
    micro: {
      cvcTooltip: 'The 3-digit code on the back of your card.',
      savedCard: 'Visa ···· {last4}',
    },
  },

  /* 12. Crypto advanced option --------------------------------------- */
  /* ONLY buyer surface that acknowledges crypto. Understated, opt-in,   */
  /* below the fold. Still no wallet/chain/token language.               */
  advancedPay: {
    primary: {
      reveal: 'More ways to pay',
      label: 'Pay with a stablecoin balance',
      sub: 'Advanced · for buyers who already hold one',
    },
    alt: {
      reveal: ['Other payment options'],
      label: ['Pay with a digital dollar balance'],
      sub: ['Advanced option'],
    },
    micro: {
      tooltip:
        'For buyers who already hold a stablecoin balance. Most people use card or Apple Pay.',
    },
  },

  /* 13. Processing --------------------------------------------------- */
  processing: {
    primary: {
      phase1: 'Processing your payment…',
      phase2: 'Confirming your order…',
      phase3: 'Almost done…',
      sub: 'Please keep this page open.',
    },
    alt: {
      phase1: ['Securing your payment…'],
      phase2: ['Finalizing your order…'],
      sub: ['This only takes a moment.'],
    },
    micro: {
      slowPath:
        "This is taking a moment — we'll email your confirmation. You can safely close this page.",
    },
  },

  /* 14. Order confirmed ---------------------------------------------- */
  confirmed: {
    primary: {
      title: 'Payment confirmed',
      body: "Thanks, {firstName}. We've emailed your receipt to {email}.",
      orderNumber: 'Order number',
      totalPaid: 'Total paid',
      method: 'Payment method',
      delivery: 'Estimated delivery',
      detailsToggle: 'Payment details',
      ctaPrimary: 'Continue shopping',
      ctaSecondary: 'View order status',
    },
    alt: {
      title: ["You're all set", 'Order confirmed'],
      body: ["Your order's on its way. A receipt is in your inbox."],
    },
    micro: {
      // buyer-safe "advanced" technical details
      amountCharged: 'Amount charged',
      date: 'Date',
      orderId: 'Order ID',
      paymentReference: 'Payment reference',
      processor: 'Processor',
      secureAccount: 'Secure account',
      downloadReceipt: 'Download receipt (PDF)',
      referenceTooltip:
        'Share this code with support if you have a question about your payment.',
    },
  },

  /* 15. Receipt email ------------------------------------------------ */
  receiptEmail: {
    primary: {
      subject: 'Your {merchant} receipt — order {order}',
      preheader: "Payment confirmed. Here's your receipt.",
      heading: 'Thanks for your order, {firstName}',
      body: 'Your payment was confirmed and your order is being prepared.',
      sectionOrder: 'Order summary',
      sectionShipping: 'Shipping to',
      sectionPayment: 'Payment',
      footer: 'Payment securely processed by MOSS on behalf of {merchant}.',
      support:
        'Questions about your order? Reply to this email or contact {merchant}.',
    },
    alt: {
      subject: ['Order confirmed — {merchant}', 'Receipt for your {merchant} order'],
      heading: ["You're all set, {firstName}"],
    },
    micro: {
      reference: 'Payment reference: {ref}',
      legalFooter: 'This is a receipt for your records. No action needed.',
    },
  },

  /* 16. Payment failed ----------------------------------------------- */
  /* Never surface backend reason. Buyer always held harmless.          */
  paymentFailed: {
    primary: {
      title: "Your payment didn't go through",
      body: 'No charge was made. Try another payment method to complete your order.',
      cta: 'Try another method',
    },
    alt: {
      title: ["That payment couldn't be completed"],
      body: ["Don't worry — you weren't charged. Choose another way to pay."],
      cta: ['Choose another method', 'Try again'],
    },
    micro: {
      cardDeclined: 'Your card was declined. Try a different card or another method.',
      reassurance: "You haven't been charged.",
    },
  },

  /* 17. Login failed ------------------------------------------------- */
  loginFailed: {
    primary: {
      expired: 'That code expired. Send a new one.',
      wrong: "That code isn't right. Check and try again.",
      cta: 'Resend code',
    },
    alt: {
      generic: ["We couldn't sign you in. Let's try again."],
      wrong: ["Your code didn't match. Want a new one?"],
    },
    micro: {
      lockedOut: 'Too many tries. Please wait a moment and request a new code.',
      socialFail: "We couldn't finish signing you in. Try again or use email.",
    },
  },

  /* 18. Provider unavailable ----------------------------------------- */
  providerUnavailable: {
    primary: {
      inline: "{method} isn't available right now. Try another way to pay.",
      applePay: "Apple Pay isn't set up on this device. Use a card or another method.",
    },
    alt: {
      generic: [
        'This option is temporarily unavailable. Please choose another.',
        "We can't reach {method} at the moment — try again or pick another method.",
      ],
    },
    micro: {
      othersOk: 'All other payment methods are working normally.',
      signInDown:
        'Apple sign-in is unavailable right now. Continue with email instead.',
    },
  },

  /* 19. Settlement pending (buyer visibility) ------------------------ */
  /* Buyers should see NOTHING about settlement. If a confirmation is    */
  /* ever delayed, map it to ORDER FULFILLMENT language only.            */
  orderProcessing: {
    primary: {
      title: 'Payment confirmed — order processing.',
      body: "We've received your payment. Your order is being prepared.",
    },
    alt: {
      title: ['All set — your order is being processed.'],
      body: ["Confirmed. We'll email you when it ships."],
    },
    micro: {
      statusChip: 'Processing', // → Preparing → Shipped → Delivered
      tooltip:
        'Your payment is complete. This just means your order is being prepared.',
    },
  },
} satisfies CopySystem;

export type Copy = typeof copy;

/* ------------------------------------------------------------------ */
/* Accessor: t('block.slot', vars)                                     */
/* ------------------------------------------------------------------ */

type PrimaryKeys<B extends keyof Copy> = keyof Copy[B]['primary'] & string;

/**
 * Resolve a primary copy string with token interpolation.
 *   t('cart', 'cta', { total: '$104.50' }) -> 'Checkout · $104.50'
 */
export function t<B extends keyof Copy>(
  block: B,
  slot: PrimaryKeys<B>,
  vars?: CopyVars
): string {
  const template = (copy[block].primary as Record<string, string>)[slot];
  return fill(template, vars);
}

/* ------------------------------------------------------------------ */
/* Guardrail: banned vocabulary + approved replacements                */
/* ------------------------------------------------------------------ */

/** Words that must never appear in default buyer-facing copy. */
export const BANNED: readonly string[] = [
  'wallet',
  'gas',
  'chain',
  'blockchain',
  'bridge',
  'bridging',
  'swap',
  'signature',
  'seed phrase',
  'recovery phrase',
  'private key',
  'transaction hash',
  'tx hash',
  'usdm',
  'pyusd',
  'on-chain',
  'off-chain',
  'mint',
  'gasless',
  'connect wallet',
  'pre-fund',
];

/** Approved replacements (avoid → use). */
export const REPLACEMENTS: Record<string, string> = {
  wallet: 'secure account / your account',
  crypto: 'stablecoin balance / digital dollar balance (advanced only)',
  gas: '(omit — fees are baked into one total)',
  chain: '(omit)',
  bridge: '(omit)',
  swap: '(omit)',
  signature: 'confirm / pay / continue',
  'seed phrase': 'passkey / secure sign-in',
  'transaction hash': 'payment reference',
  usdm: '(omit entirely)',
  pyusd: '(buyer never sees this)',
  'connect wallet': 'sign in',
  'pre-fund': '(omit — Model B never asks buyers to fund)',
  gasless: 'fast / instant / no extra steps',
};

/**
 * Dev/test guardrail. Throws if a string contains banned vocabulary.
 * Use in unit tests to keep buyer copy clean as the system grows.
 *   Object.values(copy).forEach(b => Object.values(b.primary).forEach(assertBuyerSafe))
 */
export function assertBuyerSafe(text: string, where = 'copy'): void {
  const lower = text.toLowerCase();
  const hit = BANNED.find((w) => lower.includes(w));
  if (hit) {
    throw new Error(
      `Buyer-copy rule violated in ${where}: contains "${hit}". ` +
        `Use an approved replacement (see REPLACEMENTS).`
    );
  }
}

export default copy;
