import { Star, ShoppingCart, Heart, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import React from 'react';

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div onClick={() => onProductClick(product)}>
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-chart-1 text-white">Baru</Badge>}
            {discount > 0 && <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Category */}
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {product.category}
            </Badge>

            {/* Product Name */}
            <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-lg text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
            </div>

            {/* Seller Info */}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>
                {product.seller} • {product.location}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full"
          variant="outline"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Tambah ke Keranjang
        </Button>
      </div>
    </Card>
  );
}
