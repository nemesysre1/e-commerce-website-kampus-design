import { ProductCard } from "./ProductCard";
import { Tag, Percent } from "lucide-react";

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

interface PromoSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function PromoSection({ products, onAddToCart, onProductClick }: PromoSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-accent/30 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg flex items-center space-x-2">
                <Percent className="w-4 h-4" />
                <span>PROMO SPESIAL</span>
              </div>
              <Tag className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-2xl font-medium text-primary mb-2">
              Produk Promo Terbatas
            </h2>
            <p className="text-muted-foreground">
              Hemat hingga 40% untuk produk pilihan UMKM Kampus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {product.originalPrice && (
                <div className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg z-10 shadow-lg">
                  <span>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
              />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada produk promo saat ini</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
              Lihat Semua Promo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
