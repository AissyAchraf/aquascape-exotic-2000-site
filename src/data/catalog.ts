import { Category, Product } from './types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Aquariums',
    slug: 'aquariums',
    subcategories: [
      { id: 'sub-1', name: 'Nano Tanks', slug: 'nano-tanks', categoryId: 'cat-1' },
      { id: 'sub-2', name: 'Standard Tanks', slug: 'standard-tanks', categoryId: 'cat-1' },
      { id: 'sub-3', name: 'Rimless Tanks', slug: 'rimless-tanks', categoryId: 'cat-1' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Hardscape',
    slug: 'hardscape',
    subcategories: [
      { id: 'sub-4', name: 'Rocks', slug: 'rocks', categoryId: 'cat-2' },
      { id: 'sub-5', name: 'Driftwood', slug: 'driftwood', categoryId: 'cat-2' },
      { id: 'sub-6', name: 'Substrate', slug: 'substrate', categoryId: 'cat-2' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Plants',
    slug: 'plants',
    subcategories: [
      { id: 'sub-7', name: 'Foreground', slug: 'foreground', categoryId: 'cat-3' },
      { id: 'sub-8', name: 'Midground', slug: 'midground', categoryId: 'cat-3' },
      { id: 'sub-9', name: 'Background', slug: 'background-plants', categoryId: 'cat-3' },
      { id: 'sub-10', name: 'Mosses', slug: 'mosses', categoryId: 'cat-3' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Equipment',
    slug: 'equipment',
    subcategories: [
      { id: 'sub-11', name: 'Filters', slug: 'filters', categoryId: 'cat-4' },
      { id: 'sub-12', name: 'Lighting', slug: 'lighting', categoryId: 'cat-4' },
      { id: 'sub-13', name: 'CO2 Systems', slug: 'co2-systems', categoryId: 'cat-4' },
      { id: 'sub-14', name: 'Tools', slug: 'tools', categoryId: 'cat-4' },
    ],
  },
  {
    id: 'cat-5',
    name: 'New',
    slug: 'new',
    subcategories: [
    ],
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'UltraClear Rimless 60P',
    slug: 'ultraclear-rimless-60p',
    reference: 'AQ-001',
    description: 'Premium ultra-clear glass rimless aquarium, 60cm. Perfect for planted aquascapes with crystal clear viewing from every angle.',
    categoryId: 'cat-1',
    subcategoryId: 'sub-3',
    variants: [
      { id: 'v1', name: '60x30x36cm', size: '60P', image: '/placeholder.svg', price: 129, onSale: false, inStock: true },
      { id: 'v2', name: '60x30x45cm', size: '60H', image: '/placeholder.svg', price: 149, onSale: false, inStock: true },
    ],
    characteristics: { Glass: '6mm Ultra-Clear', Volume: '60L', Dimensions: '60x30x36cm', Silicon: 'Black' },
    images: ['/placeholder.svg', '/placeholder.svg'],
    isBestSeller: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-2',
    name: 'Seiryu Stone Set',
    slug: 'seiryu-stone-set',
    reference: 'HS-002',
    description: 'Hand-selected Seiryu stone set ideal for Iwagumi-style aquascapes. Natural grey-blue tones with dramatic veining.',
    categoryId: 'cat-2',
    subcategoryId: 'sub-4',
    variants: [
      { id: 'v3', name: '5kg Set', size: '5kg', image: '/placeholder.svg', price: 45, onSale: false, inStock: true },
      { id: 'v4', name: '10kg Set', size: '10kg', image: '/placeholder.svg', price: 79, onSale: false, inStock: true },
      { id: 'v5', name: '15kg Set', size: '15kg', image: '/placeholder.svg', price: 110, originalPrice: 135, onSale: true, inStock: true },
    ],
    characteristics: { Type: 'Seiryu', Origin: 'Natural', 'pH Impact': 'Slightly raises pH', Use: 'Iwagumi, Nature style' },
    images: ['/placeholder.svg', '/placeholder.svg'],
    isBestSeller: true,
    isPromotion: true,
    createdAt: '2024-02-10',
  },
  {
    id: 'prod-3',
    name: 'Spider Wood XL',
    slug: 'spider-wood-xl',
    reference: 'HS-003',
    description: 'Beautiful branching spider wood piece, perfect for creating dramatic natural layouts. Pre-soaked and ready for use.',
    categoryId: 'cat-2',
    subcategoryId: 'sub-5',
    variants: [
      { id: 'v6', name: 'Medium (25-35cm)', size: 'M', image: '/placeholder.svg', price: 32, onSale: false, inStock: true },
      { id: 'v7', name: 'Large (35-50cm)', size: 'L', image: '/placeholder.svg', price: 55, onSale: false, inStock: true },
      { id: 'v8', name: 'XL (50-70cm)', size: 'XL', image: '/placeholder.svg', price: 85, onSale: false, inStock: false },
    ],
    characteristics: { Type: 'Spider Wood', Preparation: 'Pre-soaked', Tannins: 'Minimal', Safe: 'Shrimp & Fish safe' },
    images: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: '2024-03-05',
  },
  {
    id: 'prod-4',
    name: 'Monte Carlo Tissue Culture',
    slug: 'monte-carlo-tissue-culture',
    reference: 'PL-004',
    description: 'Micranthemum Monte Carlo in vitro tissue culture. Premium carpeting plant that creates lush green foregrounds.',
    categoryId: 'cat-3',
    subcategoryId: 'sub-7',
    variants: [
      { id: 'v9', name: '1 Cup', size: '1 cup', image: '/placeholder.svg', price: 12, onSale: false, inStock: true },
      { id: 'v10', name: '3 Cup Bundle', size: '3 cups', image: '/placeholder.svg', price: 30, originalPrice: 36, onSale: true, inStock: true },
    ],
    characteristics: { Type: 'Carpeting', Difficulty: 'Medium', Light: 'Medium-High', CO2: 'Recommended', Growth: 'Moderate' },
    images: ['/placeholder.svg'],
    isBestSeller: true,
    isPromotion: true,
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-5',
    name: 'Bucephalandra Green Wavy',
    slug: 'bucephalandra-green-wavy',
    reference: 'PL-005',
    description: 'Rare Bucephalandra variety with beautiful wavy green leaves. Attaches naturally to hardscape.',
    categoryId: 'cat-3',
    subcategoryId: 'sub-8',
    variants: [
      { id: 'v11', name: 'Small Portion', size: 'S', image: '/placeholder.svg', price: 18, onSale: false, inStock: true },
      { id: 'v12', name: 'Large Portion', size: 'L', image: '/placeholder.svg', price: 32, onSale: false, inStock: false },
    ],
    characteristics: { Type: 'Epiphyte', Difficulty: 'Easy', Light: 'Low-Medium', CO2: 'Not required', Growth: 'Slow' },
    images: ['/placeholder.svg'],
    createdAt: '2023-12-01',
  },
  {
    id: 'prod-6',
    name: 'Twinstar LED 600EA',
    slug: 'twinstar-led-600ea',
    reference: 'EQ-006',
    description: 'High-performance full spectrum LED light designed for planted aquariums. Adjustable intensity with sleek aluminum body.',
    categoryId: 'cat-4',
    subcategoryId: 'sub-12',
    variants: [
      { id: 'v13', name: '60cm', size: '60cm', image: '/placeholder.svg', price: 189, onSale: false, inStock: true },
      { id: 'v14', name: '90cm', size: '90cm', image: '/placeholder.svg', price: 259, onSale: false, inStock: true },
    ],
    characteristics: { Spectrum: 'Full RGB', Power: '45W', Adjustable: 'Yes', Material: 'Aluminum', Warranty: '2 years' },
    images: ['/placeholder.svg', '/placeholder.svg'],
    isBestSeller: true,
    createdAt: '2024-02-28',
  },
  {
    id: 'prod-7',
    name: 'Pro CO2 System Complete',
    slug: 'pro-co2-system-complete',
    reference: 'EQ-007',
    description: 'Complete pressurized CO2 system with dual-stage regulator, solenoid valve, bubble counter, and ceramic diffuser.',
    categoryId: 'cat-4',
    subcategoryId: 'sub-13',
    variants: [
      { id: 'v15', name: 'With 2L Cylinder', size: '2L', image: '/placeholder.svg', price: 220, originalPrice: 280, onSale: true, inStock: true },
      { id: 'v16', name: 'With 5L Cylinder', size: '5L', image: '/placeholder.svg', price: 290, originalPrice: 350, onSale: true, inStock: true },
    ],
    characteristics: { Regulator: 'Dual-stage', Solenoid: 'Included', Diffuser: 'Ceramic inline', Tubing: '3m included' },
    images: ['/placeholder.svg', '/placeholder.svg'],
    isPromotion: true,
    createdAt: '2024-03-10',
  },
  {
    id: 'prod-8',
    name: 'ADA Amazonia V2 Soil',
    slug: 'ada-amazonia-v2-soil',
    reference: 'HS-008',
    description: 'Premium aqua soil substrate specifically formulated for planted aquariums. Lowers pH and provides essential nutrients.',
    categoryId: 'cat-2',
    subcategoryId: 'sub-6',
    variants: [
      { id: 'v17', name: '3L Bag', size: '3L', image: '/placeholder.svg', price: 25, onSale: false, inStock: true },
      { id: 'v18', name: '9L Bag', size: '9L', image: '/placeholder.svg', price: 55, onSale: false, inStock: true },
      { id: 'v19', name: '9L Bag (Powder)', size: '9L Powder', image: '/placeholder.svg', price: 58, onSale: false, inStock: true },
    ],
    characteristics: { Type: 'Active substrate', 'pH Effect': 'Lowers pH', Nutrients: 'Rich in organics', Color: 'Black', Granule: 'Normal / Powder' },
    images: ['/placeholder.svg'],
    isBestSeller: true,
    createdAt: '2024-03-01',
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return products.filter(p => p.categoryId === category.id);
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  const sub = category.subcategories.find(s => s.slug === subcategorySlug);
  if (!sub) return [];
  return products.filter(p => p.subcategoryId === sub.id);
}

export function getProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.reference.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

export function getBestSellers(): Product[] {
  return products.filter(p => p.isBestSeller);
}

export function getPromotions(): Product[] {
  return products.filter(p => p.isPromotion);
}

export function isProductAvailable(product: Product): boolean {
  return product.variants.some(v => v.inStock);
}

function getDisplayVariant(product: Product) {
  return product.variants.reduce((cheapest, v) => (v.price < cheapest.price ? v : cheapest));
}

export function getMinPrice(product: Product): number {
  return getDisplayVariant(product).price;
}

export function getOriginalPrice(product: Product): number | undefined {
  const variant = getDisplayVariant(product);
  return variant.onSale ? variant.originalPrice ?? undefined : undefined;
}
