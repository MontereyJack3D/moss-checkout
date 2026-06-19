import { Link } from 'react-router-dom';
import { useCheckout } from '../../state/CheckoutContext';
import { MERCHANT, SEED_ORDERS } from '../../data/mockData';
import { money, settlementAmount } from '../../lib/format';
import { METHOD_LABEL, type PaymentStatus } from '../../lib/types';
import { Shield } from '../icons';

function SettleBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; d: string; label: string }> = {
    settling: { c: 'bg-amber-50 text-amber-600', d: 'bg-amber-500', label: 'Settling' },
    settled: { c: 'bg-moss-50 text-moss-600', d: 'bg-moss-500', label: 'Settled' },
    paid: { c: 'bg-blue-50 text-blue-600', d: 'bg-blue-500', label: 'Confirmed' },
  };
  const m = map[status] ?? map.paid;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${m.c}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.d}`} />
      {m.label}
    </span>
  );
}

/**
 * Partner dashboard preview. When a buyer completes the demo checkout, the
 * live order appears here and you can watch the merchant receive USDm
 * (paid -> settling -> settled).
 */
export function DashboardPreview() {
  const { intent } = useCheckout();
  const liveSettled = intent?.status === 'settled';
  const settledBase = 12038;
  const settledTotal = settledBase + (liveSettled ? intent.merchantReceives : 0);

  const liveOrder =
    intent && ['paid', 'settling', 'settled'].includes(intent.status)
      ? {
          id: intent.orderNumber,
          items: 'Current demo order',
          total: intent.amount,
          method: intent.method ? METHOD_LABEL[intent.method] : '—',
          settle: intent.status as PaymentStatus,
          date: 'Now',
          live: true,
        }
      : null;

  const orders = [
    ...(liveOrder ? [liveOrder] : []),
    ...SEED_ORDERS.map((o) => ({ ...o, live: false })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-moss-600 text-white grid place-items-center font-bold">
          {MERCHANT.initial}
        </div>
        <div>
          <div className="font-semibold flex items-center gap-1.5">
            {MERCHANT.name} <Shield className="text-moss-600" />
          </div>
          <div className="text-[12px] text-sub">Partner dashboard · preview</div>
        </div>
        <Link to="/" className="ml-auto text-[13px] text-moss-700 font-semibold">
          ← Back to store
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Gross sales (30d)', value: money(12480.5 + (intent && intent.status !== 'failed' ? intent.amount : 0)) },
          { label: 'Settled to payout', value: settlementAmount(settledTotal) },
          { label: 'Currently settling', value: intent?.status === 'settling' ? settlementAmount(intent.merchantReceives) : '$0.00' },
          { label: 'You get paid in', value: 'USDm', accent: true },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border p-4 ${k.accent ? 'bg-moss-50 border-moss-200' : 'bg-white border-line'}`}>
            <div className={`text-[12px] ${k.accent ? 'text-moss-700' : 'text-sub'}`}>{k.label}</div>
            <div className={`text-[20px] font-bold mt-1 ${k.accent ? 'text-moss-700' : ''}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {liveOrder && (
        <div className="rounded-xl bg-moss-50 border border-moss-200 text-moss-700 text-[13px] px-4 py-3 mb-4 flex items-center gap-2">
          <Shield />
          {liveOrder.settle === 'settled'
            ? `Your demo order settled — you received ${settlementAmount(intent!.merchantReceives)}.`
            : liveOrder.settle === 'settling'
            ? 'Your demo order is settling now — watch the status update to Settled.'
            : 'Payment confirmed — settlement starting…'}
        </div>
      )}

      {/* Orders */}
      <div className="rounded-2xl bg-white border border-line overflow-hidden">
        <div className="px-4 py-3 border-b border-line font-semibold text-[14px]">Recent orders</div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-sub bg-sand/50">
              <th className="px-4 py-2.5 font-medium">Order</th>
              <th className="px-4 py-2.5 font-medium">Items</th>
              <th className="px-4 py-2.5 font-medium">Total</th>
              <th className="px-4 py-2.5 font-medium hidden sm:table-cell">Method</th>
              <th className="px-4 py-2.5 font-medium">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id} className={o.live ? 'bg-moss-50/40' : ''}>
                <td className="px-4 py-3 font-mono">
                  {o.id}
                  {o.live && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-moss-600 text-white">LIVE</span>}
                </td>
                <td className="px-4 py-3 text-sub">{o.items}</td>
                <td className="px-4 py-3 font-semibold">{money(o.total)}</td>
                <td className="px-4 py-3 text-sub hidden sm:table-cell">{o.method}</td>
                <td className="px-4 py-3">
                  <SettleBadge status={o.settle} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[12px] text-sub flex items-center gap-1.5">
        <Shield className="text-moss-600" /> MOSS handles all orchestration — you just choose how you get paid.
      </div>
    </div>
  );
}
