import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Upload, CheckCircle2, Wallet, QrCode } from 'lucide-react';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  cartItems?: CartItem[];
  onCompleted?: (data: {
    orderNumber: string;
    date: string;
    total: number;
    itemCount: number;
    paymentMethod: string;
    items: CartItem[];
  }) => void;
}

type PaymentMethod = 'qris' | 'dana' | 'ovo' | null;

export function CheckoutModal({
  isOpen,
  onClose,
  total,
  itemCount,
  cartItems = [],
  onCompleted,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'payment' | 'upload' | 'success'>('payment');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  const handlePaymentSelect = (method: PaymentMethod) => setSelectedPayment(method);

  const continueToUpload = () => {
    if (!selectedPayment) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }
    setStep('upload');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getPaymentMethodName = () => {
    switch (selectedPayment) {
      case 'qris': return 'QRIS';
      case 'dana': return 'DANA';
      case 'ovo': return 'OVO';
      default: return '';
    }
  };

  const getPaymentNumber = () => {
    switch (selectedPayment) {
      case 'qris': return 'Scan QR Code di bawah';
      case 'dana': return '081234567890';
      case 'ovo': return '081234567890';
      default: return '';
    }
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      toast.error('Upload bukti pembayaran terlebih dahulu');
      return;
    }

    const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
    if (onCompleted) {
      onCompleted({
        orderNumber,
        date: new Date().toISOString(),
        total,
        itemCount,
        paymentMethod: getPaymentMethodName(),
        items: cartItems,
      });
    }

    toast.success('Bukti pembayaran berhasil diupload!');
    setStep('success');
  };

  const finish = () => {
    setStep('payment');
    setSelectedPayment(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={finish}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'payment' && 'Pilih Metode Pembayaran'}
            {step === 'upload' && 'Upload Bukti Pembayaran'}
            {step === 'success' && 'Pembayaran Berhasil'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Step */}
          {step === 'payment' && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Item</span>
                  <span className="font-medium">{itemCount} item</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total Pembayaran</span>
                  <span className="text-primary font-bold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Pilih Metode Pembayaran</Label>

                {['qris', 'dana', 'ovo'].map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePaymentSelect(method as PaymentMethod)}
                    className={`w-full p-4 border-2 rounded-lg flex items-center space-x-4 ${selectedPayment === method ? 'border-primary bg-primary/5' : 'border-border'}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedPayment === method ? 'bg-primary text-white' : 'bg-muted'}`}>
                      {method === 'qris' ? <QrCode className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {method === 'qris' ? 'Scan QR untuk membayar' : `Transfer via ${method.toUpperCase()}`}
                      </p>
                    </div>
                    {selectedPayment === method && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>

              <Button className="w-full mt-2" onClick={continueToUpload}>
                Lanjutkan
              </Button>
            </>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Metode Pembayaran</span>
                  <span className="font-medium">{getPaymentMethodName()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total Pembayaran</span>
                  <span className="font-medium text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* QR / Payment Info */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20 text-center">
                {selectedPayment === 'qris' && (
                  <div className="inline-block bg-white p-4 rounded-lg">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-700" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Scan QR dengan aplikasi e-wallet</p>
                  </div>
                )}
                {(selectedPayment === 'dana' || selectedPayment === 'ovo') && (
                  <div className="space-y-3">
                    <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center">
                      <Wallet className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Nomor {getPaymentMethodName()}</p>
                      <p className="text-2xl font-mono tracking-wider">{getPaymentNumber()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">a.n. UMKM Kampus Store</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Upload Bukti Pembayaran</Label>
                <div className="border-2 border-dashed p-6 rounded-lg text-center">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain mb-3 rounded-lg" />
                      <Button variant="outline" size="sm" onClick={() => { setUploadedFile(null); setPreviewUrl(null); }}>
                        Ganti
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <Label htmlFor="payment-proof" className="cursor-pointer text-primary hover:underline">
                        Klik untuk upload
                      </Label>
                      <Input
                        id="payment-proof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG, JPEG maksimal 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep('payment')}>
                  Kembali
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  Kirim Bukti
                </Button>
              </div>
            </>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-700" />
              </div>
              <p className="font-medium text-lg">Pembayaran berhasil diupload!</p>
              <p className="text-muted-foreground text-sm">Bukti pembayaran sedang menunggu verifikasi.</p>
              <Button className="w-full mt-3" onClick={finish}>
                Selesai
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
