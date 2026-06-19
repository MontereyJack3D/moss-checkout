import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StoreHeader } from '../components/storefront';
import { productBySlug, MERCHANT } from '../data/mockData';
import { money } from '../lib/format';
import { useCart } from '../state/CartContext';
import { Shield } from '../components/icons';
import { PrimaryButton } from '../components/ui';

export function ProductPage() {
  const { slug } = useParams();
  const product = slug ? productBySlug(slug) : undefined;
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen">
        <StoreHeader />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-sub">Product not found.</p>
          <Link to="/" className="text-moss-700 font-semibold">
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StoreHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="text-[13px] text-sub hover:text-ink">
          ← All products
        </Link>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="rounded-3xl bg-sand aspect-square grid place-items-center text-[140px] shadow-card">
            {product.emoji}
          </div>
          <div>
            {product.badge && (
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-moss-50 text-moss-700">
                {product.badge}
              </span>
            )}
            <h1 className="text-[28px] font-bold tracking-tight mt-2">{product.name}</h1>
            <div className="text-[22px] font-bold mt-1">{money(product.price)}</div>
            <p className="text-[14px] text-sub mt-4 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-line rounded-xl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 text-lg text-sub">
                  −
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 text-lg text-sub">
                  +
                </button>
              </div>
              <span className="text-[12px] text-sub">{product.stock} in stock</span>
            </div>

            <div className="mt-6 space-y-2.5 max-w-sm">
              <PrimaryButton
                onClick={() => {
                  add(product, qty);
                  navigate('/cart');
                }}
              >
                Add to bag · {money(product.price * qty)}
              </PrimaryButton>
            </div>

            {product.researchOnly && (
              <div className="mt-5 rounded-xl bg-amber-50 text-amber-700 text-[12px] px-4 py-3 flex items-start gap-2">
                <Shield />
                <span>{MERCHANT.disclaimer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
