import { StoreHeader, ProductCard } from '../components/storefront';
import { PRODUCTS, MERCHANT } from '../data/mockData';
import { Shield } from '../components/icons';

export function StorefrontPage() {
  return (
    <div className="min-h-screen">
      <StoreHeader />

      {/* hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-moss-600 to-moss-700 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/15 rounded-full px-2.5 py-1 mb-4">
              <Shield /> Lab-grade · lot-tracked
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-bold leading-[1.05] tracking-tight">
              Research peptides &amp; supplies, shipped fast.
            </h1>
            <p className="text-white/80 mt-3 text-[15px]">
              Premium research-use-only catalog with a checkout that just works. Pay how you like — we handle the rest.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[160px] opacity-20 select-none">🧪</div>
        </div>
      </section>

      {/* grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[18px] font-bold">Shop all</h2>
          <span className="text-[13px] text-sub">{PRODUCTS.length} products</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="text-center text-[11px] text-sub mt-8">{MERCHANT.disclaimer}</p>
      </section>
    </div>
  );
}
