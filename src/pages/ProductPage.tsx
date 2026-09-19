import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: categoriesData } = useCategories();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[3/4] rounded-md" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-foreground">Product not found</h1>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const available = product.variants.some(v => v.inStock);
  const categories = categoriesData || [];
  const category = categories.find(c => c.id === product.categoryId);

  const handleAddToCart = () => {
    if (!variant.inStock) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantName: variant.name,
      price: variant.price,
      image: product.images[0] || '/placeholder.svg',
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Get unique colors
  const colors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 font-body">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-secondary rounded-md overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!available && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-unavailable text-unavailable-foreground text-sm uppercase tracking-wider px-4 py-2">
                  No Longer Available
                </Badge>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square bg-secondary rounded overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-start gap-3 mb-2">
              {product.isPromotion && available && (
                <Badge className="bg-sale text-sale-foreground text-[10px] uppercase tracking-wider">Sale</Badge>
              )}
              {product.isBestSeller && (
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Best Seller</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground mb-1">{product.name}</h1>
            <p className="text-sm text-muted-foreground font-body mb-4">Ref: {product.reference}</p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium text-foreground font-body">{variant.price.toFixed(2)}DH</span>
              {variant.onSale && variant.originalPrice && (
                <span className="text-lg text-muted-foreground line-through font-body">{variant.originalPrice.toFixed(2)}DH</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8">{product.description}</p>

            {/* Color swatches */}
            {colors.length > 1 && (
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground mb-3 font-body">Color</p>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        variant.color === color ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        const idx = product.variants.findIndex(v => v.color === color);
                        if (idx >= 0) setSelectedVariant(idx);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Variant selector */}
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground mb-3 font-body">Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariant(i); setQuantity(1); }}
                    disabled={!v.inStock}
                    className={`px-4 py-2 text-xs font-medium font-body rounded-md border transition-all ${
                      i === selectedVariant
                        ? 'border-primary bg-primary text-primary-foreground'
                        : v.inStock
                          ? 'border-border text-foreground hover:border-primary'
                          : 'border-border text-muted-foreground line-through opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to cart */}
            {variant.inStock && (
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium font-body">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-body text-sm tracking-wider uppercase"
                  size="lg"
                >
                  {added ? (
                    <span className="flex items-center gap-2"><Check size={16} /> Added</span>
                  ) : (
                    <span className="flex items-center gap-2"><ShoppingBag size={16} /> Add to Cart</span>
                  )}
                </Button>
              </div>
            )}

            {/* Characteristics */}
            <div className="border-t border-border pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4 font-body">Characteristics</h3>
              <dl className="space-y-2">
                {Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key} className="flex text-sm font-body">
                    <dt className="w-32 text-muted-foreground">{key}</dt>
                    <dd className="text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
