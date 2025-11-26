import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Toaster, toast } from "sonner";
import { Upload, CheckCircle2, Wallet, QrCode } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
}

type PaymentMethod = "qris" | "dana" | "ovo" | null;

export function CheckoutModal({ isOpen, onClose, total, itemCount }: CheckoutModalProps) {
  const [step, setStep] = useState<"payment" | "upload" | "success">("payment");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleContinueToUpload = () => {
    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran terlebih dahulu");
      return;
    }
    setStep("upload");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setUploadedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!uploadedFile) {
      toast.error("Silakan upload bukti pembayaran");
      return;
    }

    // Simulate payment processing
    toast.success("Bukti pembayaran berhasil diupload!");
    setStep("success");
  };

  const handleClose = () => {
    setStep("payment");
    setSelectedPayment(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const getPaymentMethodName = () => {
    switch (selectedPayment) {
      case "qris":
        return "QRIS";
      case "dana":
        return "DANA";
      case "ovo":
        return "OVO";
      default:
        return "";
    }
  };

  const getPaymentNumber = () => {
    switch (selectedPayment) {
      case "qris":
        return "Scan QR Code di bawah";
      case "dana":
        return "081234567890";
      case "ovo":
        return "081234567890";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "payment" && "Pilih Metode Pembayaran"}
            {step === "upload" && "Upload Bukti Pembayaran"}
            {step === "success" && "Pembayaran Berhasil"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method Selection */}
          {step === "payment" && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Item</span>
                  <span className="font-medium">{itemCount} item</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Pembayaran</span>
                  <span className="font-medium text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Pilih Metode Pembayaran</Label>
                
                {/* QRIS Option */}
                <button
                  onClick={() => handlePaymentSelect("qris")}
                  className={`w-full p-4 border-2 rounded-lg flex items-center space-x-4 transition-all hover:border-primary ${
                    selectedPayment === "qris" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "qris" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">QRIS</p>
                    <p className="text-xs text-muted-foreground">Scan QR untuk membayar</p>
                  </div>
                  {selectedPayment === "qris" && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>

                {/* DANA Option */}
                <button
                  onClick={() => handlePaymentSelect("dana")}
                  className={`w-full p-4 border-2 rounded-lg flex items-center space-x-4 transition-all hover:border-primary ${
                    selectedPayment === "dana" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "dana" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">DANA</p>
                    <p className="text-xs text-muted-foreground">Transfer via DANA</p>
                  </div>
                  {selectedPayment === "dana" && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>

                {/* OVO Option */}
                <button
                  onClick={() => handlePaymentSelect("ovo")}
                  className={`w-full p-4 border-2 rounded-lg flex items-center space-x-4 transition-all hover:border-primary ${
                    selectedPayment === "ovo" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedPayment === "ovo" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">OVO</p>
                    <p className="text-xs text-muted-foreground">Transfer via OVO</p>
                  </div>
                  {selectedPayment === "ovo" && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </button>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleContinueToUpload}
                disabled={!selectedPayment}
              >
                Lanjutkan
              </Button>
            </>
          )}

          {/* Upload Payment Proof */}
          {step === "upload" && (
            <>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span className="font-medium">{getPaymentMethodName()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Pembayaran</span>
                  <span className="font-medium text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* QR Code / Payment Info Section */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border-2 border-primary/20">
                <div className="text-center space-y-3">
                  <p className="text-sm font-medium">Bayar ke:</p>
                  
                  {/* QR Code placeholder for QRIS */}
                  {selectedPayment === "qris" && (
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <div className="w-48 h-48 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {/* QR Code Pattern Simulation */}
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-sm ${
                                Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                              }`}
                            />
                          ))}
                        </div>
                        <QrCode className="w-16 h-16 text-white relative z-10" />
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Number for DANA/OVO */}
                  {(selectedPayment === "dana" || selectedPayment === "ovo") && (
                    <div className="space-y-3">
                      <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center">
                        <Wallet className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Nomor {getPaymentMethodName()}</p>
                        <p className="text-2xl font-mono tracking-wider">{getPaymentNumber()}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        a.n. UMKM Kampus Store
                      </p>
                    </div>
                  )}
                  
                  {selectedPayment === "qris" && (
                    <p className="text-xs text-muted-foreground">
                      Scan dengan aplikasi e-wallet Anda
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Upload Bukti Pembayaran</Label>
                <p className="text-sm text-muted-foreground">
                  Setelah melakukan pembayaran, upload bukti transfer atau screenshot pembayaran
                </p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview bukti pembayaran" 
                        className="w-full h-48 object-contain rounded-lg bg-muted"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {uploadedFile?.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Ganti
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <Label htmlFor="payment-proof" className="cursor-pointer">
                        <span className="text-primary hover:underline">Klik untuk upload</span>
                        <span className="text-muted-foreground"> atau drag & drop</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, JPEG maksimal 5MB
                      </p>
                      <Input
                        id="payment-proof"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep("payment")}
                >
                  Kembali
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmitPayment}
                  disabled={!uploadedFile}
                >
                  Kirim Bukti
                </Button>
              </div>
            </>
          )}

          {/* Success State */}
          {step === "success" && (
            <>
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Pembayaran Berhasil Diupload!</h3>
                  <p className="text-sm text-muted-foreground">
                    Bukti pembayaran Anda sedang diproses. Kami akan mengirimkan konfirmasi melalui email dalam 1x24 jam.
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Metode Pembayaran</span>
                    <span className="font-medium">{getPaymentMethodName()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Pembayaran</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-orange-600">Menunggu Verifikasi</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleClose}>
                Selesai
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}