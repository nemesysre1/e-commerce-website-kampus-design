import { useState } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  seller: string;
  location: string;
  category: string;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

type CategoryFilter = "Semua" | "Makanan" | "Fashion" | "Kerajinan" | "Digital";

export function ProductGrid({ products, onAddToCart, onProductClick }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Semua");
  const [showAllProducts, setShowAllProducts] = useState(false);

  const categories: CategoryFilter[] = ["Semua", "Makanan", "Fashion", "Kerajinan", "Digital"];

  const filteredProducts = selectedCategory === "Semua" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Show only first 8 products unless "Lihat Semua" is clicked
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  const handleCategoryClick = (category: CategoryFilter) => {
    setSelectedCategory(category);
    setShowAllProducts(false); // Reset when category changes
  };

  const handleShowAll = () => {
    setShowAllProducts(true);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-medium text-primary mb-2">
              Produk Unggulan
            </h2>
            <p className="text-muted-foreground">
              Temukan produk terbaik dari UMKM kampus pilihan
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          ))}
        </div>

        {!showAllProducts && filteredProducts.length > 8 && (
          <div className="text-center mt-8">
            <button 
              onClick={handleShowAll}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Lihat Semua Produk ({filteredProducts.length})
            </button>
          </div>
        )}

        {showAllProducts && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
            </p>
          </div>
        )}
      </div>
    </section>
  );
}