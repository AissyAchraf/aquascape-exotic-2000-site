import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CATEGORY_GAP_PX = 32; // matches the `gap-8` utility below

const categoryLinkClass =
  'text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors';

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();
  const { data: categories = [], isLoading } = useCategories();

  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const moreButtonMeasureRef = useRef<HTMLDivElement>(null);
  const itemMeasureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [visibleCount, setVisibleCount] = useState(categories.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Measure how many category links fit on one line; overflow goes in "More".
  useLayoutEffect(() => {
    if (isLoading || categories.length === 0) return;

    const calculateVisibleCount = () => {
      const containerWidth = navContainerRef.current?.offsetWidth ?? 0;
      const widths = categories.map(
        cat => itemMeasureRefs.current[cat.id]?.offsetWidth ?? 0
      );
      const totalWidth = widths.reduce(
        (sum, w, i) => sum + w + (i > 0 ? CATEGORY_GAP_PX : 0),
        0
      );

      if (totalWidth <= containerWidth) {
        setVisibleCount(categories.length);
        return;
      }

      const moreWidth =
        (moreButtonMeasureRef.current?.offsetWidth ?? 0) + CATEGORY_GAP_PX;
      const budget = containerWidth - moreWidth;

      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i++) {
        const next = used + widths[i] + (i > 0 ? CATEGORY_GAP_PX : 0);
        if (next > budget) break;
        used = next;
        count++;
      }
      setVisibleCount(count);
    };

    calculateVisibleCount();

    const observer = new ResizeObserver(calculateVisibleCount);
    if (navContainerRef.current) observer.observe(navContainerRef.current);
    return () => observer.disconnect();
  }, [categories, isLoading]);

  // Close the "More" panel on outside click.
  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  const visibleCategories = categories.slice(0, visibleCount);
  const overflowCategories = categories.slice(visibleCount);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-xl font-extrabold tracking-wider text-primary">
            AQUASCAPE<sub><small><i>by Exotic2000</i></small></sub>
          </Link>

          {/* Desktop Nav */}
          <div
            ref={navContainerRef}
            className="hidden lg:flex flex-1 min-w-0 items-center justify-center relative overflow-hidden"
          >
            <nav className="flex items-center gap-8">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))
              ) : (
                <>
                  {visibleCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className={categoryLinkClass}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {overflowCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMoreOpen(prev => !prev)}
                      className={cn(categoryLinkClass, 'flex items-center gap-1', moreOpen && 'text-foreground')}
                      aria-expanded={moreOpen}
                      aria-haspopup="true"
                    >
                      More
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform', moreOpen && 'rotate-180')}
                      />
                    </button>
                  )}
                </>
              )}
            </nav>

            {/* Hidden measurement layer: mirrors every category link to compute natural widths */}
            {!isLoading && (
              <div
                className="absolute top-0 left-0 flex items-center gap-8 invisible pointer-events-none whitespace-nowrap"
                aria-hidden="true"
              >
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    ref={el => (itemMeasureRefs.current[cat.id] = el)}
                    className={categoryLinkClass}
                  >
                    {cat.name}
                  </div>
                ))}
                <div
                  ref={moreButtonMeasureRef}
                  className={cn(categoryLinkClass, 'flex items-center gap-1')}
                >
                  More
                  <ChevronDown size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <Link
              to="/cart"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="pb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, reference..."
                  className="w-full bg-secondary text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-md font-body"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overflow categories ("More") panel — full-width, drops below the navbar */}
      <AnimatePresence>
        {moreOpen && overflowCategories.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-background border-t border-border shadow-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-wrap gap-x-8 gap-y-3">
              {overflowCategories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={categoryLinkClass}
                  onClick={() => setMoreOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-24" />
                ))
              ) : (
                categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="text-sm font-medium tracking-wide text-foreground py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
