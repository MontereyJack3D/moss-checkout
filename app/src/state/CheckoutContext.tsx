import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  CustomerInfo,
  PaymentIntent,
  PaymentMethod,
  PaymentStatus,
  SecureAccount,
  SignInProvider,
} from '../lib/types';
import { createIntent, runSettlement, signIn, submitPayment } from '../lib/mockApi';
import { useCart } from './CartContext';

interface CheckoutValue {
  open: boolean;
  status: PaymentStatus;
  account: SecureAccount | null;
  customer: CustomerInfo | null;
  intent: PaymentIntent | null;
  method: PaymentMethod | null;
  error: string | null;
  amount: number;

  openCheckout: () => void;
  close: () => void;
  reset: () => void;
  back: () => void;

  doSignIn: (provider: SignInProvider, email?: string) => Promise<void>;
  confirmPasskey: () => void;
  submitCustomer: (info: CustomerInfo) => void;
  pay: (method: PaymentMethod, simulateDecline?: boolean) => Promise<void>;
}

const CheckoutContext = createContext<CheckoutValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('awaiting_login');
  const [account, setAccount] = useState<SecureAccount | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);

  const cancelSettlement = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelSettlement.current?.(), []);

  const reset = () => {
    cancelSettlement.current?.();
    cancelSettlement.current = null;
    setStatus('awaiting_login');
    setAccount(null);
    setCustomer(null);
    setIntent(null);
    setMethod(null);
    setError(null);
  };

  const openCheckout = () => {
    setAmount(cart.total);
    reset();
    setOpen(true);
  };

  const close = () => setOpen(false);

  /** Step backward where it makes sense; close from the first step. */
  const back = () => {
    setError(null);
    setStatus((s) => {
      if (s === 'awaiting_passkey') return 'awaiting_login';
      if (s === 'awaiting_customer_info') return 'awaiting_login';
      if (s === 'awaiting_payment') return 'awaiting_customer_info';
      if (s === 'failed') return 'awaiting_payment';
      setOpen(false);
      return s;
    });
  };

  const doSignIn: CheckoutValue['doSignIn'] = async (provider, email) => {
    const acct = await signIn(provider, email);
    setAccount(acct);
    // New accounts do the one-time MOSS passkey setup; returning accounts skip it.
    setStatus(acct.returning ? 'awaiting_customer_info' : 'awaiting_passkey');
  };

  const confirmPasskey: CheckoutValue['confirmPasskey'] = () => {
    setStatus('awaiting_customer_info');
  };

  const submitCustomer: CheckoutValue['submitCustomer'] = (info) => {
    setCustomer(info);
    setStatus('awaiting_payment');
  };

  const pay: CheckoutValue['pay'] = async (chosen, simulateDecline = false) => {
    setMethod(chosen);
    setError(null);
    setStatus('processing_payment');

    const pi = intent ?? (await createIntent(amount));
    setIntent({ ...pi, method: chosen, status: 'processing_payment' });

    const result = await submitPayment(chosen, { simulateDecline });

    if (result === 'failed') {
      setStatus('failed');
      setError('declined');
      setIntent((cur) => (cur ? { ...cur, status: 'failed' } : cur));
      return;
    }

    // Payment captured.
    setStatus('paid');
    setIntent((cur) => (cur ? { ...cur, status: 'paid' } : cur));
    cart.clear();

    // Kick off the invisible merchant settlement (USDm).
    cancelSettlement.current = runSettlement((s) => {
      setStatus(s);
      setIntent((cur) => (cur ? { ...cur, status: s } : cur));
    });
  };

  const value: CheckoutValue = {
    open,
    status,
    account,
    customer,
    intent,
    method,
    error,
    amount,
    openCheckout,
    close,
    reset,
    back,
    doSignIn,
    confirmPasskey,
    submitCustomer,
    pay,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
