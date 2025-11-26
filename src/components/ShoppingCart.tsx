import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckoutModal } from "./CheckoutModal";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function ShoppingCart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: ShoppingCartProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15000; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    onClose(); // Close cart when checkout is closed
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 h-full">
          <SheetHeader className="px-4 sm:px-6 py-4 border-b">
            <SheetTitle className="flex items-center justify-between">
              <span>Keranjang Belanja</span>
              {items.length > 0 && (
                <span className="text-sm text-muted-foreground font-normal">
                  ({items.length} item)
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col flex-1 min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                    <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <p className="text-muted-foreground">Keranjang belanja kosong</p>
                  <Button onClick={onClose}>Mulai Belanja</Button>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.seller}
                          </p>
                          <p className="font-medium text-sm sm:text-base mt-1.5">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 flex-shrink-0"
                              onClick={() => 
                                item.quantity > 1 
                                  ? onUpdateQuantity(item.id, item.quantity - 1)
                                  : onRemoveItem(item.id)
                              }
                            >
                              {item.quantity > 1 ? (
                                <Minus className="w-3 h-3" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                            <span className="text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 flex-shrink-0"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t bg-background px-4 sm:px-6 py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-medium text-lg">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Checkout
                    </Button>
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      Lanjut Belanja
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
        total={total}
        itemCount={items.length}
      />
    </>
  );
}