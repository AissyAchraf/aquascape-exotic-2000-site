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
        {product.isPromotion && available && (
          <motion.div
            initial={{ x: '-100%', rotate: -45 }}
            animate={{ x: 0, rotate: -45 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="absolute left-[-42px] top-[18px] w-[150px] bg-sale py-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-sale-foreground shadow-[0_2px_6px_rgba(0,0,0,0.35)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/30"
          >
            {discountPercent && discountPercent > 0 ? `-${discountPercent}%` : 'Sale'}
          </motion.div>
        )}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {!available && (
            <Badge variant="secondary" className="bg-unavailable text-unavailable-foreground text-[10px] uppercase tracking-wider">
              Sold Out
            </Badge>
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
