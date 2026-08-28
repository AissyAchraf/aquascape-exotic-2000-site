import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isProductAvailable, getMinPrice, getOriginalPrice } from '@/data/catalog';
import { Product } from '@/data/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const available = isProductAvailable(product);
  const price = getMinPrice(product);
  const originalPrice = getOriginalPrice(product);
  const discountPercent = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : undefined;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] bg-secondary rounded-md overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!available && (
            <Badge variant="secondary" className="bg-unavailable text-unavailable-foreground text-[10px] uppercase tracking-wider">
              Sold Out
            </Badge>
          )}
          {product.isPromotion && available && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center rounded-md bg-gradient-to-br from-sale to-sale/85 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-sale-foreground shadow-md ring-1 ring-white/25"
            >
              {discountPercent && discountPercent > 0 ? `-${discountPercent}%` : 'Sale'}
            </motion.span>
          )}
          {product.isBestSeller && available && (
            <Badge variant="outline" className="bg-background/80 text-foreground text-[10px] uppercase tracking-wider border-border">
              Best Seller
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-body">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground font-body">Ref: {product.reference}</p>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium font-body ${!available ? 'text-muted-foreground' : 'text-foreground'}`}>
            {price.toFixed(2)}DH
          </span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through font-body">
              {originalPrice.toFixed(2)}DH
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
