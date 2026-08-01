import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground font-body mb-8">Discover our collection and find something you love.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase font-body rounded-md hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 border-b border-border pb-4">
              <Link to={`/product/${item.productId}`} className="w-20 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.productId}`} className="font-body text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {item.productName}
                </Link>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{item.variantName}</p>
                <p className="text-sm font-medium text-foreground font-body mt-1">{item.price.toFixed(2)}DH</p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="p-1 text-foreground hover:text-primary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-body">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="p-1 text-foreground hover:text-primary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground font-body">
                  {(item.price * item.quantity).toFixed(2)}DH
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-md p-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm font-body mb-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{getTotal().toFixed(2)}DH</span>
          </div>
          <div className="flex justify-between text-sm font-body mb-4">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">Calculated at checkout</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between text-base font-medium font-body">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{getTotal().toFixed(2)}DH</span>
          </div>
          <Button asChild className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 font-body text-sm tracking-wider uppercase" size="lg">
            <Link to="/checkout">
              Checkout <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
