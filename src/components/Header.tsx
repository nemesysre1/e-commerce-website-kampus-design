import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function Header({ cartItemCount, onCartClick, onLoginClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-medium text-primary">UMKM USU</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input type="search" placeholder="Cari produk UMKM..." className="pl-10" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {["beranda", "promo", "produk", "tentang"].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(sec);
                }}
                className="text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {sec.charAt(0).toUpperCase() + sec.slice(1)}
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">

            {/* Jika belum login */}
            {!user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Masuk</span>
              </Button>
            )}

            {/* Jika sudah login */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <span className="font-medium">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input type="search" placeholder="Cari produk UMKM..." className="pl-10" />
          </div>
        </div>
      </div>
    </header>
  );
}
