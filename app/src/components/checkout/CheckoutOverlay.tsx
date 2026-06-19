import { useCheckout } from '../../state/CheckoutContext';
import { MERCHANT } from '../../data/mockData';
import { Lock, ArrowLeft, Close } from '../icons';
import {
  SignInStep,
  ShippingStep,
  PaymentStep,
  ProcessingStep,
  ConfirmationStep,
} from './steps';
import { PasskeyStep } from './PasskeyStep';

/**
 * Full-screen hosted-checkout overlay. Status-driven: the current
 * PaymentStatus selects which step renders.
 */
export function CheckoutOverlay() {
  const { open, status, back, close } = useCheckout();
  if (!open) return null;

  const showBack = ['awaiting_passkey', 'awaiting_customer_info', 'awaiting_payment', 'failed'].includes(status);
  const showClose = !['processing_payment', 'paid', 'settling', 'settled'].includes(status);

  const step = () => {
    switch (status) {
      case 'awaiting_login':
        return <SignInStep />;
      case 'awaiting_passkey':
        return <PasskeyStep />;
      case 'awaiting_customer_info':
        return <ShippingStep />;
      case 'awaiting_payment':
      case 'failed':
        return <PaymentStep />;
      case 'processing_payment':
        return <ProcessingStep />;
      case 'paid':
      case 'settling':
      case 'settled':
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[radial-gradient(1200px_600px_at_50%_-10%,#f4f6f2,#e4e7e1)]">
      <div className="min-h-full flex flex-col items-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-[440px]">
          {/* merchant header */}
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-9 h-9 rounded-xl bg-moss-600 text-white grid place-items-center font-bold">
              {MERCHANT.initial}
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-[15px]">{MERCHANT.name}</div>
              <div className="text-[11px] text-sub">{MERCHANT.tagline}</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-sub">
                <Lock /> Secure
              </span>
              {showClose && (
                <button onClick={close} className="p-1.5 rounded-lg hover:bg-white/60 text-sub" aria-label="Close checkout">
                  <Close />
                </button>
              )}
            </div>
          </div>

          {/* card */}
          <div className="bg-white rounded-3xl shadow-pop overflow-hidden">
            {showBack && (
              <div className="px-5 pt-4">
                <button onClick={back} className="text-ink/40 hover:text-ink/70 -ml-1 p-1 rounded-lg" aria-label="Back">
                  <ArrowLeft />
                </button>
              </div>
            )}
            <div className="px-5 pb-6 pt-2 sm:px-7">{step()}</div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-sub">
            <Lock /> Secured by <span className="font-semibold text-ink/55">MOSS</span>
            <span className="mx-1">·</span> We never store full card numbers
          </div>
        </div>
      </div>
    </div>
  );
}
