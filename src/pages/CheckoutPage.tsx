import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { submitOrder } from '@/services/orderService';
import { CustomerInfo } from '@/data/types';

const customerSchema = z.object({
  firstName: z.string().trim().min(1, 'Required').max(100),
  lastName: z.string().trim().min(1, 'Required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(1, 'Required').max(30),
  address: z.string().trim().min(1, 'Required').max(500),
  city: z.string().trim().min(1, 'Required').max(100),
  notes: z.string().max(1000).optional(),
});

const CheckoutPage = () => {
  const { items, getTotal, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = customerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const customer = result.data as CustomerInfo;
      await submitOrder(items, customer);
      setConfirmed(true);
      clearCart();
    } catch {
      setSubmitError('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !confirmed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-foreground mb-4">Nothing to checkout</h1>
        <Link to="/" className="text-primary font-body text-sm underline">Continue Shopping</Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-20 text-center max-w-md"
      >
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-success-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground font-body mb-2">
          Thank you for your order. We will contact you shortly to confirm the details.
        </p>
        <p className="text-muted-foreground font-body mb-8 text-sm">
          No payment is required now — our team will reach out to finalize your order.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase font-body rounded-md hover:opacity-90"
        >
          Back to Shop
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-foreground mb-2">Your Information</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="First name" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} className="font-body" />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Input placeholder="Last name" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} className="font-body" />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <Input type="email" placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="font-body" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Input placeholder="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="font-body" />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Input placeholder="Address" value={form.address} onChange={e => handleChange('address', e.target.value)} className="font-body" />
            {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
          </div>
          <div>
            <Input placeholder="City" value={form.city} onChange={e => handleChange('city', e.target.value)} className="font-body" />
            {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
          </div>
          <div>
            <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} className="font-body" />
          </div>
          {submitError && <p className="text-sm text-destructive font-body">{submitError}</p>}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 font-body text-sm tracking-wider uppercase"
            size="lg"
          >
            {submitting ? 'Submitting...' : 'Confirm Order'}
          </Button>
          <p className="text-xs text-muted-foreground font-body text-center">
            No payment required. We will contact you to finalize.
          </p>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-secondary rounded-md p-4">
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Your Items</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm font-body">
                  <div>
                    <p className="text-foreground">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.variantName} × {item.quantity}</p>
                  </div>
                  <p className="text-foreground">{(item.price * item.quantity).toFixed(2)}DH</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-3 flex justify-between font-body font-medium text-foreground">
              <span>Total</span>
              <span>{getTotal().toFixed(2)}DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
