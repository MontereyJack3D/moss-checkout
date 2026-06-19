import { useState } from 'react';
import { useCheckout } from '../../state/CheckoutContext';
import { PrimaryButton } from '../ui';
import { Shield } from '../icons';

/**
 * One-time MOSS passkey setup. This is the single moment anything "web3"
 * happens for the buyer — and it's framed as ordinary biometric security
 * (Face ID / Touch ID). Behind the scenes it activates the buyer's secure
 * MOSS account on-chain; a small "What is this?" reveal explains that for the
 * demo. Returning accounts never see this step again.
 */
export function PasskeyStep() {
  const { confirmPasskey } = useCheckout();
  const [sheet, setSheet] = useState(false);
  const [phase, setPhase] = useState<'prompt' | 'signing' | 'done'>('prompt');
  const [info, setInfo] = useState(false);

  const openSheet = () => {
    setSheet(true);
    setPhase('prompt');
  };

  const authorize = () => {
    setPhase('signing');
    setTimeout(() => setPhase('done'), 1300);
    setTimeout(() => {
      setSheet(false);
      confirmPasskey();
    }, 2100);
  };

  return (
    <div className="animate-fadeUp text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-moss-50 text-moss-600 grid place-items-center mb-4">
        <FaceIdGlyph />
      </div>
      <h1 className="text-[22px] font-bold">Set up your secure account</h1>
      <p className="text-[13px] text-sub mt-1.5 mb-5 max-w-[320px] mx-auto">
        Create a passkey to protect your account and check out in one tap next time. Use Face ID,
        Touch ID, or your device PIN.
      </p>

      <ul className="text-left max-w-[300px] mx-auto space-y-2 mb-6">
        {['One-time setup — never again on this device', 'No passwords to remember', 'Works across your devices'].map(
          (t) => (
            <li key={t} className="flex items-center gap-2.5 text-[13px] text-ink/75">
              <span className="w-5 h-5 rounded-full bg-moss-50 text-moss-600 grid place-items-center flex-none">
                <Shield />
              </span>
              {t}
            </li>
          ),
        )}
      </ul>

      <PrimaryButton onClick={openSheet}>Create passkey</PrimaryButton>

      <button onClick={() => setInfo((v) => !v)} className="mt-3 text-[12px] text-ink/45 hover:text-ink/70">
        What is this?
      </button>
      {info && (
        <div className="mt-2 text-left rounded-xl bg-amber-50/60 p-3 text-[12px] text-amber-700/90 leading-relaxed animate-fadeUp">
          <span className="font-semibold">One-time, behind the scenes:</span> your passkey also activates
          your secure MOSS account so payments can settle. It's the only setup step that ever happens —
          after this, checkout is just tap-and-pay.
        </div>
      )}

      {sheet && <PasskeySheet phase={phase} onAuthorize={authorize} />}
    </div>
  );
}

/* Simulated OS passkey sheet -------------------------------------- */
function PasskeySheet({
  phase,
  onAuthorize,
}: {
  phase: 'prompt' | 'signing' | 'done';
  onAuthorize: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full sm:max-w-[360px] bg-white rounded-t-3xl sm:rounded-3xl shadow-pop p-6 animate-fadeUp">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-moss-600 text-white grid place-items-center font-bold">P</div>
          <div className="leading-tight text-left">
            <div className="text-[14px] font-semibold">Peptide Partners</div>
            <div className="text-[12px] text-sub">pay.peptidepartners.com</div>
          </div>
        </div>

        <div className="text-center py-3">
          {phase === 'done' ? (
            <div className="mx-auto w-16 h-16 rounded-full bg-moss-50 text-moss-600 grid place-items-center animate-pop">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          ) : phase === 'signing' ? (
            <div className="mx-auto w-16 h-16 rounded-full border-[3px] border-moss-100 border-t-moss-600 spin" />
          ) : (
            <div className="mx-auto w-16 h-16 rounded-2xl bg-ink/5 text-ink grid place-items-center">
              <FaceIdGlyph size={36} />
            </div>
          )}
          <h3 className="text-[16px] font-bold mt-4">
            {phase === 'done' ? 'Passkey created' : phase === 'signing' ? 'Verifying…' : 'Use Face ID to continue'}
          </h3>
          <p className="text-[12px] text-sub mt-1">
            {phase === 'done'
              ? 'Your account is ready.'
              : phase === 'signing'
              ? 'Confirming with your device.'
              : 'Create a passkey for "Peptide Partners".'}
          </p>
        </div>

        {phase === 'prompt' && (
          <div className="mt-3">
            <PrimaryButton onClick={onAuthorize}>Continue</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

function FaceIdGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M9 10v1M15 10v1M12 10v3l-1 1M9.5 15.5a3.5 3.5 0 0 0 5 0" />
    </svg>
  );
}
