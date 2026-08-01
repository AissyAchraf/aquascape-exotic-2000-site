import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/data/catalog';
import ProductCard from '@/components/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const results = query ? searchProducts(query) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        Search Results
      </h1>
      <p className="text-muted-foreground font-body mb-8">
        {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      </p>

      {results.length === 0 ? (
        <p className="text-muted-foreground font-body py-12 text-center">
          No products found. Try a different search term.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
