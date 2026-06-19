import { Link } from 'react-router-dom';
import { StoreHeader } from '../components/storefront';
import { useCart } from '../state/CartContext';
import { useCheckout } from '../state/CheckoutContext';
import { money } from '../lib/format';
import { MERCHANT } from '../data/mockData';
import { PrimaryButton } from '../components/ui';
import { Bag } from '../components/icons';

export function CartPage() {
  const { lines, subtotal, shipping, total, setQty, remove } = useCart();
  const { openCheckout } = useCheckout();

  return (
    <div className="min-h-screen">
      <StoreHeader />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-[24px] font-bold mb-1">Your bag</h1>

        {lines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white/60 py-16 text-center mt-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-sand text-sub grid place-items-center mb-3">
              <Bag />
            </div>
            <p className="font-semibold">Your bag is empty</p>
            <p className="text-[13px] text-sub mt-1 mb-4">Add a few research supplies to get started.</p>
            <Link to="/" className="text-moss-700 font-semibold text-[14px]">
              Browse products →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-sub mb-5">{lines.length} items from {MERCHANT.name}</p>
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.product.id} className="flex items-center gap-3 bg-white rounded-2xl border border-line p-3">
                  <div className="w-14 h-14 rounded-xl bg-sand grid place-items-center text-2xl">{l.product.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">{l.product.name}</div>
                    <div className="text-[12px] text-sub">{money(l.product.price)} each</div>
                    <button onClick={() => remove(l.product.id)} className="text-[11px] text-sub hover:text-red-500 mt-0.5">
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center border border-line rounded-lg">
                    <button onClick={() => setQty(l.product.id, l.qty - 1)} className="w-8 h-9 text-sub">
                      −
                    </button>
                    <span className="w-7 text-center text-[13px] font-semibold">{l.qty}</span>
                    <button onClick={() => setQty(l.product.id, l.qty + 1)} className="w-8 h-9 text-sub">
                      +
                    </button>
                  </div>
                  <div className="w-16 text-right text-[14px] font-semibold">{money(l.product.price * l.qty)}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-line p-5 mt-5">
              <div className="space-y-2 text-[13px]">
                <Row l="Subtotal" r={money(subtotal)} />
                <Row l="Shipping" r={money(shipping)} />
                <div className="flex justify-between pt-2 border-t border-line text-[16px] font-bold">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
              <div className="mt-5">
                <PrimaryButton onClick={openCheckout}>Checkout · {money(total)}</PrimaryButton>
              </div>
              <p className="text-center text-[11px] text-sub mt-3">{MERCHANT.disclaimer}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => (
  <div className="flex justify-between text-sub">
    <span>{l}</span>
    <span className="text-ink/80">{r}</span>
  </div>
);
