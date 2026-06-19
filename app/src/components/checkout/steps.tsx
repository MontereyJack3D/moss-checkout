import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../state/CheckoutContext';
import type { CustomerInfo, PaymentMethod, SignInProvider } from '../../lib/types';
import { METHOD_LABEL } from '../../lib/types';
import { money } from '../../lib/format';
import { copy } from '../../data/copy';
import { verifyEmailCode } from '../../lib/mockApi';
import { Field, PrimaryButton, Divider, KV, Spinner } from '../ui';
import { PaymentDetails } from './PaymentDetails';
import {
  AppleMark,
  GoogleMark,
  MailMark,
  PasskeyMark,
  CardMark,
  CoinMark,
  Chevron,
  Check,
  Close,
  Lock,
} from '../icons';

/* ============================================================ SIGN IN */
export function SignInStep() {
  const { doSignIn, amount } = useCheckout();
  const [mode, setMode] = useState<'choose' | 'email' | 'code' | 'provisioning'>('choose');
  const [email, setEmail] = useState('chris@example.com');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeErr, setCodeErr] = useState('');
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const provision = async (provider: SignInProvider) => {
    setMode('provisioning');
    await doSignIn(provider, email);
  };

  if (mode === 'provisioning') {
    return (
      <div className="py-10 text-center animate-fadeUp">
        <div className="mx-auto w-10 h-10 rounded-full border-2 border-moss-100 border-t-moss-600 spin mb-5" />
        <h2 className="text-[18px] font-bold">{copy.signIn.provisioning}</h2>
        <p className="text-[13px] text-sub mt-1">{copy.signIn.provisioningSub}</p>
      </div>
    );
  }

  if (mode === 'code') {
    const submit = async () => {
      const res = await verifyEmailCode(code.join(''));
      if (!res.ok) {
        setCodeErr(copy.signIn.expired);
        return;
      }
      void provision('email');
    };
    return (
      <div className="animate-fadeUp">
        <h1 className="text-[22px] font-bold mb-1">{copy.signIn.codeTitle}</h1>
        <p className="text-[13px] text-sub mb-5">
          {copy.signIn.codeBody} <span className="text-ink/80 font-medium">{email}</span>.
        </p>
        <div className="flex gap-2 justify-between mb-2">
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => (codeRefs.current[i] = el)}
              inputMode="numeric"
              maxLength={1}
              value={c}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/, '');
                const nc = [...code];
                nc[i] = v;
                setCode(nc);
                setCodeErr('');
                if (v && i < 5) codeRefs.current[i + 1]?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !code[i] && i > 0) codeRefs.current[i - 1]?.focus();
              }}
              className={`w-full h-14 text-center text-[20px] font-semibold rounded-xl border bg-sand ${
                codeErr ? 'border-red-400 bg-red-50' : 'border-ink/15 focus:border-moss-600'
              }`}
            />
          ))}
        </div>
        {codeErr && <p className="text-[12px] text-red-500 mb-2">{codeErr}</p>}
        <p className="text-[12px] text-sub mb-5">
          Didn't get it?{' '}
          <button
            className="text-moss-600 font-medium"
            onClick={() => {
              setCode(['', '', '', '', '', '']);
              setCodeErr('');
            }}
          >
            {copy.signIn.resend}
          </button>{' '}
          <span className="text-ink/30">· tip: 000000 shows the expired state</span>
        </p>
        <PrimaryButton onClick={submit} disabled={code.join('').length < 6}>
          Continue
        </PrimaryButton>
      </div>
    );
  }

  if (mode === 'email') {
    return (
      <div className="animate-fadeUp">
        <h1 className="text-[22px] font-bold mb-1">{copy.signIn.emailTitle}</h1>
        <p className="text-[13px] text-sub mb-5">{copy.signIn.emailBody}</p>
        <Field
          label="Email"
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5"
        />
        <PrimaryButton
          onClick={() => {
            setMode('code');
            setTimeout(() => codeRefs.current[0]?.focus(), 50);
          }}
          disabled={!email.includes('@')}
        >
          {copy.signIn.sendCode}
        </PrimaryButton>
      </div>
    );
  }

  // choose
  return (
    <div className="animate-fadeUp">
      <h1 className="text-[22px] font-bold mb-1">{copy.signIn.title}</h1>
      <p className="text-[13px] text-sub mb-1">{copy.signIn.body}</p>
      <p className="text-[13px] text-moss-700 font-semibold mb-5">Order total {money(amount)}</p>
      <div className="space-y-2.5">
        <SignBtn onClick={() => provision('passkey')} icon={<PasskeyMark />} label={copy.signIn.passkey} sub={copy.signIn.passkeySub} />
        <SignBtn onClick={() => provision('apple')} icon={<AppleMark />} label={copy.signIn.apple} />
        <SignBtn onClick={() => provision('google')} icon={<GoogleMark />} label={copy.signIn.google} />
        <Divider>or</Divider>
        <SignBtn onClick={() => setMode('email')} icon={<MailMark />} label={copy.signIn.email} />
      </div>
      <p className="text-center text-[11px] text-sub mt-5">{copy.signIn.legal}</p>
    </div>
  );
}

function SignBtn({ onClick, icon, label, sub }: { onClick: () => void; icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[52px] rounded-xl border border-ink/12 hover:border-ink/25 bg-white flex items-center gap-3 px-4 text-left active:scale-[.99] transition-transform"
    >
      <span className="text-ink">{icon}</span>
      <span className="flex-1">
        <span className="block text-[14px] font-semibold leading-tight">{label}</span>
        {sub && <span className="block text-[11px] text-sub">{sub}</span>}
      </span>
      <Chevron className="text-ink/25" />
    </button>
  );
}

/* ============================================================ SHIPPING */
export function ShippingStep() {
  const { submitCustomer, account } = useCheckout();
  const [f, setF] = useState<CustomerInfo>({
    name: 'Chris Rivers',
    email: account?.email ?? 'chris@example.com',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [save, setSave] = useState(true);
  const [touched, setTouched] = useState(false);
  const ok = f.name && f.address && f.city && f.zip;
  const set = (k: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="animate-fadeUp">
      <h1 className="text-[22px] font-bold mb-1">{copy.shipping.title}</h1>
      <p className="text-[13px] text-sub mb-5">
        Signed in as <span className="text-ink/80 font-medium">{f.email}</span>
      </p>
      <div className="space-y-3">
        <Field label="Full name" value={f.name} onChange={set('name')} error={touched && !f.name} />
        <Field label="Address" placeholder="Street address" value={f.address} onChange={set('address')} error={touched && !f.address} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" value={f.city} onChange={set('city')} error={touched && !f.city} />
          <Field label="State" value={f.state} onChange={set('state')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="ZIP" inputMode="numeric" value={f.zip} onChange={set('zip')} error={touched && !f.zip} />
          <Field label="Phone (optional)" inputMode="tel" value={f.phone} onChange={set('phone')} />
        </div>
      </div>
      <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
        <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="mt-0.5 w-5 h-5 accent-moss-600 rounded" />
        <span className="text-[13px] text-ink/70 leading-snug">{copy.shipping.save}</span>
      </label>
      <div className="mt-6">
        <PrimaryButton
          onClick={() => {
            if (!ok) {
              setTouched(true);
              return;
            }
            submitCustomer(f);
          }}
        >
          {copy.shipping.cta}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ============================================================ PAYMENT */
export function PaymentStep() {
  const { pay, amount, error } = useCheckout();
  const [cardOpen, setCardOpen] = useState(false);
  const [decline, setDecline] = useState(false);
  const [card, setCard] = useState({ num: '4242 4242 4242 4242', exp: '04/28', cvc: '123' });

  const go = (method: PaymentMethod, sim = false) => void pay(method, sim);

  return (
    <div className="animate-fadeUp">
      <h1 className="text-[22px] font-bold mb-1">{copy.payment.title}</h1>
      <p className="text-[13px] text-sub mb-4">
        {copy.payment.body} {money(amount)}.
      </p>

      {error === 'declined' && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 mb-4">
          <div className="font-semibold">{copy.failed.title}</div>
          <div className="text-red-500/90">{copy.failed.body}</div>
        </div>
      )}

      <button onClick={() => go('apple_pay')} className="w-full h-[52px] rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 mb-2.5 active:scale-[.99] transition-transform">
        <AppleMark /> Pay
      </button>
      <button onClick={() => go('google_pay')} className="w-full h-[52px] rounded-xl bg-white border border-ink/15 hover:border-ink/30 font-semibold flex items-center justify-center gap-2 mb-4 active:scale-[.99] transition-transform">
        <GoogleMark /> Pay
      </button>

      <Divider>{copy.payment.divider}</Divider>

      <button onClick={() => setCardOpen((o) => !o)} className="w-full rounded-xl border border-ink/12 px-4 py-3.5 flex items-center gap-3 my-2.5">
        <CardMark className="text-ink/70" />
        <span className="flex-1 text-left text-[14px] font-semibold">{copy.payment.card}</span>
        <Chevron className={`text-ink/30 transition-transform ${cardOpen ? 'rotate-90' : ''}`} />
      </button>
      {cardOpen && (
        <div className="rounded-xl bg-sand p-4 mb-2.5 space-y-3 animate-fadeUp">
          <Field label="Card number" inputMode="numeric" value={card.num} onChange={(e) => setCard({ ...card, num: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
            <Field label="CVC" inputMode="numeric" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-[12px] text-sub">
            <input type="checkbox" checked={decline} onChange={(e) => setDecline(e.target.checked)} className="w-4 h-4 accent-red-500" />
            Simulate a declined payment (demo)
          </label>
          <PrimaryButton onClick={() => go('card', decline)}>Pay {money(amount)}</PrimaryButton>
        </div>
      )}

      <button onClick={() => go('stablecoin')} className="w-full rounded-xl border border-ink/12 px-4 py-3.5 flex items-center gap-3 mb-2.5">
        <CoinMark className="text-ink/70" />
        <span className="flex-1 text-left">
          <span className="block text-[14px] font-semibold">{copy.payment.stablecoin}</span>
          <span className="block text-[11px] text-sub">{copy.payment.stablecoinSub}</span>
        </span>
        <Chevron className="text-ink/30" />
      </button>

      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-sub">
        <Lock /> {copy.payment.trust}
      </div>
    </div>
  );
}

/* ============================================================ PROCESSING */
export function ProcessingStep() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  return (
    <div className="py-10 text-center animate-fadeUp">
      <div className="mx-auto w-12 h-12 rounded-full border-[3px] border-moss-100 border-t-moss-600 spin mb-6" />
      <h2 className="text-[18px] font-bold">{copy.processing.phase[phase]}</h2>
      <p className="text-[13px] text-sub mt-1.5">{copy.processing.sub}</p>
      <div className="mt-6 mx-auto max-w-[220px] h-1 rounded-full bg-ink/8 overflow-hidden">
        <div className="h-full bg-moss-600 animate-bar" />
      </div>
    </div>
  );
}

/* ============================================================ CONFIRMATION */
export function ConfirmationStep() {
  const { intent, account, method, close, reset } = useCheckout();
  const navigate = useNavigate();
  if (!intent) return null;
  const email = account?.email ?? 'chris@example.com';

  const finish = (to: string) => {
    close();
    reset();
    navigate(to);
  };

  return (
    <div className="text-center animate-fadeUp">
      <div className="mx-auto w-14 h-14 rounded-full bg-moss-50 text-moss-600 grid place-items-center mb-4 animate-pop">
        <Check />
      </div>
      <h1 className="text-[22px] font-bold">{copy.confirmed.title}</h1>
      <p className="text-[13px] text-sub mt-1.5 mb-6">
        Thanks, {account?.email?.split('@')[0] ?? 'there'}. We've emailed your receipt to{' '}
        <span className="text-ink/80 font-medium">{email}</span>.
      </p>

      <div className="text-left rounded-2xl bg-sand p-4 space-y-2.5 mb-4">
        <KV k="Order number" v={intent.orderNumber} mono />
        <KV k="Total paid" v={money(intent.amount)} />
        <KV k="Payment method" v={method ? METHOD_LABEL[method] : '—'} />
        <KV k="Estimated delivery" v="3–5 business days" />
      </div>

      <div className="mb-4 flex justify-center">
        <PaymentDetails intent={intent} email={email} />
      </div>

      <div className="space-y-2.5">
        <PrimaryButton onClick={() => finish('/')}>{copy.confirmed.continue}</PrimaryButton>
        <button onClick={() => finish('/dashboard')} className="w-full h-[48px] text-[14px] font-medium text-sub hover:text-ink">
          {copy.confirmed.status}
        </button>
      </div>
    </div>
  );
}

/* Re-export Close for the overlay header */
export { Close };
