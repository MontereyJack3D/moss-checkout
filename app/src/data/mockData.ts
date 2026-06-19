/**
 * Mock data for the Peptide Partners demo storefront.
 * Fictional, research-use-only products. No real medical claims.
 */
import type { Product } from '../lib/types';

export const MERCHANT = {
  name: 'Peptide Partners',
  tagline: 'Research-use-only supplies',
  initial: 'P',
  disclaimer: 'Research-use-only. Not for human consumption.',
  settlementAsset: 'USDm' as const,
  payoutLabel: 'Treasury',
  payoutAddressMasked: '0x7a3f…be21',
};

export const PRODUCTS: Product[] = [
  {
    id: 'sku_001',
    slug: 'bpc-157-5mg',
    name: 'BPC-157 · 5mg',
    blurb: 'Lyophilized research peptide, 5mg per vial.',
    description:
      'A stabilized 15-amino-acid research peptide supplied as a lyophilized powder. Sold strictly for in-vitro laboratory research. Each vial is sealed and lot-tracked.',
    price: 42,
    emoji: '🧪',
    category: 'Peptides',
    researchOnly: true,
    stock: 120,
    badge: 'Best seller',
  },
  {
    id: 'sku_002',
    slug: 'tb-500-5mg',
    name: 'TB-500 · 5mg',
    blurb: 'Synthetic research fragment, 5mg per vial.',
    description:
      'A synthetic thymosin-beta-4 research fragment supplied lyophilized. For laboratory research use only. Not for human or veterinary use.',
    price: 55,
    emoji: '🧬',
    category: 'Peptides',
    researchOnly: true,
    stock: 64,
  },
  {
    id: 'sku_003',
    slug: 'bacteriostatic-water-30ml',
    name: 'Bacteriostatic Water · 30ml',
    blurb: 'Sterile diluent for reconstitution.',
    description:
      'Sterile bacteriostatic water with 0.9% benzyl alcohol, 30ml multi-dose vial. A general-purpose laboratory diluent.',
    price: 14,
    emoji: '💧',
    category: 'Diluents',
    researchOnly: false,
    stock: 340,
  },
  {
    id: 'sku_004',
    slug: 'ghk-cu-50mg',
    name: 'GHK-Cu · 50mg',
    blurb: 'Copper tripeptide research powder, 50mg.',
    description:
      'A copper-binding tripeptide research compound supplied as a lyophilized powder, 50mg per vial. For in-vitro research only.',
    price: 68,
    emoji: '🔬',
    category: 'Peptides',
    researchOnly: true,
    stock: 28,
    badge: 'Low stock',
  },
  {
    id: 'sku_005',
    slug: 'sterile-vial-kit',
    name: 'Sterile Vial Kit',
    blurb: 'Empty sterile vials, stoppers & seals (10-pack).',
    description:
      'A 10-pack of empty sterile glass vials with rubber stoppers and aluminum seals for laboratory storage and reconstitution.',
    price: 9,
    emoji: '🧫',
    category: 'Supplies',
    researchOnly: false,
    stock: 210,
  },
  {
    id: 'sku_006',
    slug: 'research-syringes-30pk',
    name: 'Research Syringes · 30-pack',
    blurb: 'Graduated lab syringes for measured dosing.',
    description:
      'Disposable graduated syringes for accurate laboratory measurement and transfer. 30 per box, individually wrapped.',
    price: 18,
    emoji: '💉',
    category: 'Supplies',
    researchOnly: false,
    stock: 150,
  },
];

export const SHIPPING_FLAT = 6.5;

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

/** Seed orders shown in the Partner dashboard preview (alongside the live demo order). */
export const SEED_ORDERS = [
  { id: 'PP-1M3R', items: 'BPC-157 ×1', total: 48.5, method: 'Google Pay', settle: 'settled', date: 'Jun 10' },
  { id: 'PP-8Z0A', items: 'Bacteriostatic Water ×4', total: 62.5, method: 'PayPal', settle: 'settled', date: 'Jun 9' },
  { id: 'PP-4K9D', items: 'TB-500 ×1', total: 61.5, method: 'Card', settle: 'settling', date: 'Jun 11' },
];
