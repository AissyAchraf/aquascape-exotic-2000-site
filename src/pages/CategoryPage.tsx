import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useProductsByCategory, useProductsBySubcategory } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const [page, setPage] = useState(0);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const category = categories.find(c => c.slug === categorySlug);

  const activeSubcategory = subcategorySlug
    ? category?.subcategories.find(s => s.slug === subcategorySlug)
    : null;

  const {
    data: categoryPage,
    isLoading: categoryProductsLoading,
  } = useProductsByCategory(
    !subcategorySlug ? category?.id : undefined,
    page
  );

  const {
    data: subcategoryPage,
    isLoading: subcategoryProductsLoading,
  } = useProductsBySubcategory(
    subcategorySlug ? category?.id : undefined,
    activeSubcategory?.id,
    page
  );

  const pageData = subcategorySlug ? subcategoryPage : categoryPage;
  const products = pageData?.content ?? [];
  const productsLoading = subcategorySlug ? subcategoryProductsLoading : categoryProductsLoading;

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-foreground">Category not found</h1>
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 font-body">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
          {category.name}
        </Link>
        {activeSubcategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-foreground">{activeSubcategory.name}</span>
          </>
        )}
      </nav>

      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        {activeSubcategory?.name ?? category.name}
      </h1>

      {/* Subcategory filters */}
      {!subcategorySlug && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            to={`/category/${category.slug}`}
            className="px-4 py-1.5 text-xs font-medium tracking-wide bg-primary text-primary-foreground rounded-full font-body"
          >
            All
          </Link>
          {category.subcategories.map(sub => (
            <Link
              key={sub.id}
              to={`/category/${category.slug}/${sub.slug}`}
              className="px-4 py-1.5 text-xs font-medium tracking-wide bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-body"
              onClick={() => setPage(0)}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {productsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground font-body py-12 text-center">No products found in this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pageData && pageData.totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                {!pageData.first && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: pageData.totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={i === page}
                      onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {!pageData.last && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
