import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Clock, CheckCircle2, XCircle, Package } from 'lucide-react';

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: 'pending' | 'verified' | 'rejected' | 'completed';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export function OrderHistoryModal({ isOpen, onClose, orders }: any) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (str: string) => {
    const d = new Date(str);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Menunggu Verifikasi',
          icon: Clock,
          color: 'bg-orange-100 text-orange-700 border-orange-200',
          iconColor: 'text-orange-600',
        };
      case 'verified':
        return {
          label: 'Terverifikasi',
          icon: CheckCircle2,
          color: 'bg-green-100 text-green-700 border-green-200',
          iconColor: 'text-green-600',
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          icon: XCircle,
          color: 'bg-red-100 text-red-700 border-red-200',
          iconColor: 'text-red-600',
        };
      default:
        return {
          label: 'Selesai',
          icon: Package,
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          iconColor: 'text-blue-600',
        };
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Riwayat Pesanan</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Lihat status pembayaran dan pesanan Anda</p>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Belum ada riwayat pesanan</p>
              </div>
            ) : (
              orders.map((o: any) => {
                const cfg = getStatus(o.status);
                const Icon = cfg.icon;

                return (
                  <div
                    key={o.id}
                    className="border rounded-lg p-4 hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex gap-2 items-center mb-1">
                          <p className="font-medium">#{o.orderNumber}</p>
                          <Badge
                            variant="outline"
                            className={`${cfg.color} border`}
                          >
                            <Icon className={`w-3 h-3 mr-1 ${cfg.iconColor}`} />
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(o.date)}</p>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    {o.items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}

                    <Separator className="my-3" />

                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
