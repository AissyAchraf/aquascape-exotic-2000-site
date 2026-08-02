import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Category } from '@/data/types';

const CATEGORY_GAP_PX = 32; // matches the `gap-8` utility below
const MORE_KEY = '__more__';

const categoryLinkClass =
  'text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors';

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();
  const { data: categories = [], isLoading } = useCategories();

  // Which top-level nav item currently has its detail panel open: a category id, MORE_KEY, or none.
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const closePanel = () => setActiveKey(null);

  // Mobile menu: which categories are expanded to show their subcategories.
  const [expandedMobile, setExpandedMobile] = useState<Set<string>>(new Set());
  const toggleMobileCategory = (id: string) => {
    setExpandedMobile(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Measure how many top-level category items fit on one line; overflow goes in "More".
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

  // Close the open panel on outside click.
  useEffect(() => {
    if (!activeKey) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeKey]);

  const visibleCategories = categories.slice(0, visibleCount);
  const overflowCategories = categories.slice(visibleCount);
  const activeCategory: Category | undefined =
    activeKey && activeKey !== MORE_KEY
      ? categories.find(cat => cat.id === activeKey)
      : undefined;
  const panelOpen =
    activeKey !== null &&
    ((activeKey === MORE_KEY && overflowCategories.length > 0) || !!activeCategory);

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
                  {visibleCategories.map(cat => {
                    const hasSubcategories = cat.subcategories.length > 0;
                    const isActive = activeKey === cat.id;

                    if (!hasSubcategories) {
                      return (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          className={categoryLinkClass}
                          onClick={closePanel}
                        >
                          {cat.name}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveKey(prev => (prev === cat.id ? null : cat.id))}
                        className={cn(categoryLinkClass, 'flex items-center gap-1', isActive && 'text-foreground')}
                        aria-expanded={isActive}
                        aria-haspopup="true"
                      >
                        {cat.name}
                        <ChevronDown
                          size={14}
                          className={cn('transition-transform', isActive && 'rotate-180')}
                        />
                      </button>
                    );
                  })}
                  {overflowCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveKey(prev => (prev === MORE_KEY ? null : MORE_KEY))}
                      className={cn(categoryLinkClass, 'flex items-center gap-1', activeKey === MORE_KEY && 'text-foreground')}
                      aria-expanded={activeKey === MORE_KEY}
                      aria-haspopup="true"
                    >
                      More
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform', activeKey === MORE_KEY && 'rotate-180')}
                      />
                    </button>
                  )}
                </>
              )}
            </nav>

            {/* Hidden measurement layer: mirrors every top-level item to compute natural widths */}
            {!isLoading && (
              <div
                className="absolute top-0 left-0 flex items-center gap-8 invisible pointer-events-none whitespace-nowrap"
                aria-hidden="true"
              >
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    ref={el => (itemMeasureRefs.current[cat.id] = el)}
                    className={cn(categoryLinkClass, cat.subcategories.length > 0 && 'flex items-center gap-1')}
                  >
                    {cat.name}
                    {cat.subcategories.length > 0 && <ChevronDown size={14} />}
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

      {/* Category detail panel — full-width, drops below the navbar */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block absolute top-full left-0 right-0 w-full bg-background border-t border-border shadow-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              {activeKey === MORE_KEY ? (
                <div className="flex flex-wrap gap-x-10 gap-y-6">
                  {overflowCategories.map(cat => (
                    <div key={cat.id} className="min-w-[140px]">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="block text-sm font-semibold text-foreground mb-2 hover:text-primary transition-colors"
                        onClick={closePanel}
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <ul className="space-y-1.5">
                          {cat.subcategories.map(sub => (
                            <li key={sub.id}>
                              <Link
                                to={`/category/${cat.slug}/${sub.slug}`}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                onClick={closePanel}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : activeCategory ? (
                <div>
                  <div className="flex flex-wrap gap-x-10 gap-y-3">
                    {activeCategory.subcategories.map(sub => (
                      <Link
                        key={sub.id}
                        to={`/category/${activeCategory.slug}/${sub.slug}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={closePanel}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      to={`/category/${activeCategory.slug}`}
                      className="text-sm font-semibold text-primary hover:underline"
                      onClick={closePanel}
                    >
                      Shop all {activeCategory.name} &rarr;
                    </Link>
                  </div>
                </div>
              ) : null}
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
            <nav className="container mx-auto px-4 py-4 flex flex-col">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-24 my-2" />
                ))
              ) : (
                categories.map(cat => {
                  const hasSubcategories = cat.subcategories.length > 0;
                  const isExpanded = expandedMobile.has(cat.id);

                  return (
                    <div key={cat.id} className="border-b border-border last:border-b-0">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex-1 text-sm font-medium tracking-wide text-foreground py-3"
                          onClick={() => setMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                        {hasSubcategories && (
                          <button
                            type="button"
                            onClick={() => toggleMobileCategory(cat.id)}
                            className="p-3 text-muted-foreground"
                            aria-expanded={isExpanded}
                            aria-label={`Toggle ${cat.name} subcategories`}
                          >
                            <ChevronDown
                              size={16}
                              className={cn('transition-transform', isExpanded && 'rotate-180')}
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {hasSubcategories && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pb-3 pl-4">
                              {cat.subcategories.map(sub => (
                                <Link
                                  key={sub.id}
                                  to={`/category/${cat.slug}/${sub.slug}`}
                                  className="text-sm text-muted-foreground py-1.5"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
