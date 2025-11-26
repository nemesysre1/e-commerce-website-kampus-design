import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-accent/20 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-medium text-primary leading-tight">
              Dukung UMKM 
              <span className="text-accent-foreground"> Kampus</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Platform e-commerce untuk mendukung usaha mikro, kecil, dan menengah di lingkungan kampus. 
              Temukan produk berkualitas dari mahasiswa dan civitas akademika.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToSection('produk')}
              >
                Jelajahi Produk
              </Button>
              <Button variant="outline" size="lg">
                Daftar Sebagai Penjual
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center text-white">
                  50+
                </div>
                <span>UMKM Terdaftar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center text-white">
                  200+
                </div>
                <span>Produk Tersedia</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758432370137-bda5e8a097b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZm9vZHxlbnwxfHx8fDE3NTg3Njc5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="UMKM Kampus Products"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-chart-3 rounded-full opacity-20"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-chart-4 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}