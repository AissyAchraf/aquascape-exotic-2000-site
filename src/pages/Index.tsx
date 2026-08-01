import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import heroImage from '@/assets/hero.jpg';
import { getBestSellers, getPromotions } from '@/data/catalog';
import { useCategories } from '@/hooks/useCategories';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const bestSellers = getBestSellers();
  const promotions = getPromotions();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] bg-secondary flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="New Season Collection" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-foreground/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center px-4"
        >
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-primary-foreground mb-4 tracking-tight drop-shadow-lg">
            Create Your<br />Underwater World
          </h1>
          <p className="text-lg text-primary-foreground/80 font-body mb-8 max-w-lg mx-auto drop-shadow">
            Premium aquascaping supplies, plants & equipment for stunning aquariums
          </p>
          <Link
            to="/category/aquariums"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold tracking-wider uppercase font-body hover:opacity-90 transition-opacity rounded-md"
          >
            Shop Now
          </Link>
        </motion.div>
      </section>

      {/* Categories Carousel */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">Shop by Category</h2>
        {categoriesLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square flex-1 rounded-md" />
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {categories.map(cat => (
                <CarouselItem key={cat.id} className="pl-4 basis-1/2 md:basis-1/4">
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group relative aspect-square bg-secondary rounded-md overflow-hidden flex items-end p-4 hover:ring-1 hover:ring-primary transition-all block"
                  >
                    <span className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 hidden md:flex" />
            <CarouselNext className="-right-4 hidden md:flex" />
          </Carousel>
        )}
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotions Banner */}
      {promotions.length > 0 && (
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">On Sale</h2>
            <p className="text-muted-foreground font-body mb-8">Limited time offers on selected pieces</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {promotions.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
