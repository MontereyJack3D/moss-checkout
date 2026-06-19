import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../lib/types';
import { money } from '../lib/format';
import { MERCHANT } from '../data/mockData';
import { useCart } from '../state/CartContext';
import { Bag, Shield } from './icons';

/* Store header with cart badge ----------------------------------- */
export function StoreHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-moss-600 text-white grid place-items-center font-bold">
            {MERCHANT.initial}
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[15px]">{MERCHANT.name}</div>
            <div className="text-[11px] text-sub">{MERCHANT.tagline}</div>
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <a href="/partner.html" className="text-[13px] text-sub hover:text-ink px-3 py-2 rounded-lg hidden sm:block">
            For partners
          </a>
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sand text-ink"
            aria-label="Cart"
          >
            <Bag />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-moss-600 text-white text-[11px] font-bold grid place-items-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* Product card --------------------------------------------------- */
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  return (
    <div className="group rounded-2xl bg-white border border-line overflow-hidden shadow-card hover:shadow-pop transition-shadow">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-[4/3] bg-sand grid place-items-center text-6xl relative">
          {product.emoji}
          {product.badge && (
            <span className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/90 text-ink">
              {product.badge}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-[15px] leading-tight hover:text-moss-700">{product.name}</h3>
        </Link>
        <p className="text-[12px] text-sub mt-1 line-clamp-2 min-h-[32px]">{product.blurb}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-[16px]">{money(product.price)}</span>
          <button
            onClick={() => {
              add(product);
              navigate('/cart');
            }}
            className="text-[13px] font-semibold text-moss-700 hover:text-moss-600 px-3 py-1.5 rounded-lg bg-moss-50 active:scale-95 transition-transform"
          >
            Add
          </button>
        </div>
        {product.researchOnly && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-sub">
            <Shield className="text-moss-600" /> Research-use-only
          </div>
        )}
      </div>
    </div>
  );
}
