import { useState } from 'react';
import type { PaymentIntent } from '../../lib/types';
import { METHOD_LABEL } from '../../lib/types';
import { money, settlementAmount } from '../../lib/format';
import { KV } from '../ui';
import { Chevron } from '../icons';
import { MERCHANT } from '../../data/mockData';

/**
 * Expandable "Payment details" panel.
 *
 * Two layers:
 *  1. Buyer-safe details (always shown when expanded) — amount, order id,
 *     payment reference, processor. No crypto vocabulary.
 *  2. A clearly-labeled DEMO-ONLY reveal of the behind-the-scenes settlement
 *     (PYUSD), shown only because this is a prototype. Never ships to buyers.
 */
export function PaymentDetails({ intent, email }: { intent: PaymentIntent; email: string }) {
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState(false);

  const settleLabel: Record<string, string> = {
    paid: 'Confirmed',
    settling: 'Settling',
    settled: 'Settled',
  };

  return (
    <div className="text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[12px] text-ink/45 hover:text-ink/70 inline-flex items-center gap-1"
      >
        Payment details <Chevron className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 rounded-2xl border border-ink/8 p-4 space-y-2.5 animate-fadeUp">
          <KV k="Amount charged" v={`${money(intent.amount)} USD`} />
          <KV k="Date" v={new Date(intent.createdAt).toLocaleDateString()} />
          <KV k="Order ID" v={intent.orderNumber} mono />
          <KV k="Payment reference" v={intent.reference} mono />
          <KV k="Processor" v="Card network partner" />
          <KV k="Secure account" v={email} />
          <button className="text-[12px] text-moss-600 font-medium pt-1">Download receipt (PDF)</button>

          {/* DEMO-ONLY behind-the-scenes reveal */}
          <div className="pt-3 mt-1 border-t border-dashed border-ink/10">
            <button
              onClick={() => setDemo((d) => !d)}
              className="text-[11px] font-semibold text-amber-600 inline-flex items-center gap-1"
            >
              {demo ? 'Hide' : 'Show'} settlement details
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">DEMO ONLY</span>
            </button>
            {demo && (
              <div className="mt-2 rounded-xl bg-amber-50/60 p-3 space-y-2 animate-fadeUp">
                <p className="text-[10px] text-amber-700/80 leading-snug">
                  Hidden from real buyers. Shown here to illustrate how MOSS settles the merchant.
                </p>
                <KV k="Settlement asset" v={intent.settlementAsset} />
                <KV k="Merchant receives" v={settlementAmount(intent.merchantReceives)} />
                <KV k="Settlement status" v={settleLabel[intent.status] ?? 'Processing'} />
                <KV k="Settles to" v={`${MERCHANT.payoutLabel} · ${MERCHANT.payoutAddressMasked}`} mono />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
