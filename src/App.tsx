// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { PromoSection } from './components/PromoSection';
import { ShoppingCart } from './components/ShoppingCart';
import LoginModal from './components/LoginModal';
import { Footer } from './components/Footer';
import { Toaster, toast } from 'sonner';
import { useAuth } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import AdminApp from './admin/AdminApp';

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

interface CartItem extends Product {
  quantity: number;
}

// Mock product data
const mockProducts: Product[] = [
  // Makanan (8 products)
  {
    id: '1',
    name: 'Nasi Gudeg Khas Yogyakarta - Porsi Jumbo',
    price: 25000,
    originalPrice: 30000,
    rating: 4.8,
    reviewCount: 127,
    image:
      'https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG5hc2klMjBnb3Jlbmd8ZW58MXx8fHwxNzY0MDQzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Warung Mbak Sari',
    location: 'UGM',
    category: 'Makanan',
    isNew: true,
  },
  {
    id: '2',
    name: 'Brownies Coklat Homemade - Box Isi 6',
    price: 45000,
    rating: 4.5,
    reviewCount: 156,
    image:
      'https://images.unsplash.com/photo-1566760375903-061dfd31c175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWtlJTIwZGVzc2VydCUyMHBhc3RyeXxlbnwxfHx8fDE3NjM5OTkxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Sweet Corner',
    location: 'UNAIR',
    category: 'Makanan',
  },
  {
    id: '3',
    name: 'Nasi Goreng Spesial Kampus',
    price: 20000,
    originalPrice: 25000,
    rating: 4.7,
    reviewCount: 89,
    image:
      'https://images.unsplash.com/photo-1758432370137-bda5e8a097b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZm9vZHxlbnwxfHx8fDE3NTg3Njc5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Warung Pak Budi',
    location: 'UI',
    category: 'Makanan',
  },
  {
    id: '4',
    name: 'Martabak Manis Premium - Berbagai Topping',
    price: 35000,
    rating: 4.9,
    reviewCount: 234,
    image:
      'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwc25hY2slMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQwNDMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Martabak 77',
    location: 'ITB',
    category: 'Makanan',
    isNew: true,
  },
  {
    id: '5',
    name: 'Sate Ayam Bakar - Porsi Jumbo',
    price: 30000,
    rating: 4.6,
    reviewCount: 145,
    image:
      'https://images.unsplash.com/photo-1758432370137-bda5e8a097b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZm9vZHxlbnwxfHx8fDE3NTg3Njc5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Sate Pak Haji',
    location: 'UNS',
    category: 'Makanan',
  },
  {
    id: '6',
    name: 'Dimsum Halal Fresh - Paket 8 Pcs',
    price: 28000,
    originalPrice: 35000,
    rating: 4.8,
    reviewCount: 178,
    image:
      'https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG5hc2klMjBnb3Jlbmd8ZW58MXx8fHwxNzY0MDQzMzc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Dimsum Corner',
    location: 'UNPAD',
    category: 'Makanan',
  },
  {
    id: '7',
    name: 'Bakso Malang Original - Mangkok Jumbo',
    price: 22000,
    rating: 4.7,
    reviewCount: 203,
    image:
      'https://images.unsplash.com/photo-1758432370137-bda5e8a097b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwZm9vZHxlbnwxfHx8fDE3NTg3Njc5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Bakso Kampus',
    location: 'UNDIP',
    category: 'Makanan',
  },
  {
    id: '8',
    name: 'Seblak Ceker Pedas Level 5',
    price: 18000,
    rating: 4.5,
    reviewCount: 167,
    image:
      'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwc25hY2slMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjQwNDMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Seblak Mbok Jum',
    location: 'UPI',
    category: 'Makanan',
  },

  // Fashion (8 products)
  {
    id: '9',
    name: 'Tas Rajut Handmade - Tote Bag Unik',
    price: 85000,
    originalPrice: 100000,
    rating: 4.6,
    reviewCount: 45,
    image:
      'https://images.unsplash.com/photo-1623919268210-99a34497afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzY0MDQzMzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Kreasi Mahasiswa ITB',
    location: 'Bandung',
    category: 'Fashion',
  },
  {
    id: '10',
    name: 'Kemeja Batik Modern - Limited Edition',
    price: 120000,
    originalPrice: 150000,
    rating: 4.7,
    reviewCount: 89,
    image:
      'https://images.unsplash.com/photo-1761515315375-1315503bb3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGJhdGlrJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjQwNDMzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Batik Nusantara Co.',
    location: 'UNS',
    category: 'Fashion',
    isNew: true,
  },
  {
    id: '11',
    name: 'Kaos Kampus Custom - Design Sendiri',
    price: 75000,
    rating: 4.6,
    reviewCount: 112,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Print Shop',
    location: 'ITS',
    category: 'Fashion',
  },
  {
    id: '12',
    name: 'Hijab Segi Empat Premium - Bahan Voal',
    price: 55000,
    rating: 4.8,
    reviewCount: 156,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Hijab Store',
    location: 'UIN',
    category: 'Fashion',
  },
  {
    id: '13',
    name: 'Jaket Varsity Kampus - Custom Logo',
    price: 180000,
    originalPrice: 220000,
    rating: 4.9,
    reviewCount: 78,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Jacket Custom',
    location: 'UNDIP',
    category: 'Fashion',
    isNew: true,
  },
  {
    id: '14',
    name: 'Sepatu Sneakers Canvas Lukis',
    price: 165000,
    rating: 4.7,
    reviewCount: 92,
    image:
      'https://images.unsplash.com/photo-1623919268210-99a34497afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzY0MDQzMzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Shoes Art',
    location: 'UGM',
    category: 'Fashion',
  },
  {
    id: '15',
    name: 'Dompet Kulit Asli - Handmade',
    price: 95000,
    rating: 4.6,
    reviewCount: 134,
    image:
      'https://images.unsplash.com/photo-1623919268210-99a34497afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwaGFuZG1hZGV8ZW58MXx8fHwxNzY0MDQzMzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Leather Craft',
    location: 'UNAIR',
    category: 'Fashion',
  },
  {
    id: '16',
    name: 'Scrunchie Set - Ikat Rambut Lucu',
    price: 25000,
    rating: 4.5,
    reviewCount: 189,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Aksesoris Cute',
    location: 'UI',
    category: 'Fashion',
  },

  // Kerajinan (8 products)
  {
    id: '17',
    name: 'Gelas Keramik Unik - Set of 4',
    price: 95000,
    originalPrice: 120000,
    rating: 4.8,
    reviewCount: 67,
    image:
      'https://images.unsplash.com/photo-1690540791993-99ed6e0790d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwcG90dGVyeSUyMGNlcmFtaWN8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Keramik Seni',
    location: 'ISI',
    category: 'Kerajinan',
  },
  {
    id: '18',
    name: 'Vas Bunga Keramik Handmade',
    price: 75000,
    rating: 4.7,
    reviewCount: 89,
    image:
      'https://images.unsplash.com/photo-1690540791993-99ed6e0790d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwcG90dGVyeSUyMGNlcmFtaWN8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Pottery Art',
    location: 'ISI',
    category: 'Kerajinan',
    isNew: true,
  },
  {
    id: '19',
    name: 'Hiasan Dinding Macrame - Wall Hanging',
    price: 125000,
    rating: 4.9,
    reviewCount: 56,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Macrame Studio',
    location: 'UNS',
    category: 'Kerajinan',
  },
  {
    id: '20',
    name: 'Kotak Perhiasan Kayu Ukir',
    price: 85000,
    originalPrice: 110000,
    rating: 4.6,
    reviewCount: 72,
    image:
      'https://images.unsplash.com/photo-1690540791993-99ed6e0790d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwcG90dGVyeSUyMGNlcmFtaWN8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Ukiran Jepara',
    location: 'UNDIP',
    category: 'Kerajinan',
  },
  {
    id: '21',
    name: 'Bantal Sofa Batik - Premium Quality',
    price: 55000,
    rating: 4.7,
    reviewCount: 145,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Home Craft',
    location: 'UGM',
    category: 'Kerajinan',
  },
  {
    id: '22',
    name: 'Tempat Lilin Aromaterapi Handmade',
    price: 45000,
    rating: 4.8,
    reviewCount: 98,
    image:
      'https://images.unsplash.com/photo-1690540791993-99ed6e0790d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwcG90dGVyeSUyMGNlcmFtaWN8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Candle Art',
    location: 'ITB',
    category: 'Kerajinan',
  },
  {
    id: '23',
    name: 'Tatakan Gelas Anyaman Bambu - Set 6',
    price: 35000,
    rating: 4.5,
    reviewCount: 123,
    image:
      'https://images.unsplash.com/photo-1626207170012-718f97da4480?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODc2NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Bambu Craft',
    location: 'UPI',
    category: 'Kerajinan',
  },
  {
    id: '24',
    name: 'Patung Miniatur Wayang - Koleksi',
    price: 150000,
    rating: 4.9,
    reviewCount: 45,
    image:
      'https://images.unsplash.com/photo-1690540791993-99ed6e0790d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0JTIwcG90dGVyeSUyMGNlcmFtaWN8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Wayang Art',
    location: 'ISI',
    category: 'Kerajinan',
    isNew: true,
  },

  // Digital (8 products)
  {
    id: '25',
    name: 'Template Presentasi PowerPoint Premium',
    price: 35000,
    rating: 4.9,
    reviewCount: 234,
    image:
      'https://images.unsplash.com/photo-1759156990928-0a30e0fe1bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Digital Creative',
    location: 'BINUS',
    category: 'Digital',
    isNew: true,
  },
  {
    id: '26',
    name: 'E-book Panduan Skripsi Lengkap',
    price: 50000,
    originalPrice: 75000,
    rating: 4.8,
    reviewCount: 189,
    image:
      'https://images.unsplash.com/photo-1656360088907-5109c245851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU4NzY3OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Edu Digital',
    location: 'UI',
    category: 'Digital',
  },
  {
    id: '27',
    name: 'Template Instagram Feed - 30 Design',
    price: 45000,
    rating: 4.7,
    reviewCount: 167,
    image:
      'https://images.unsplash.com/photo-1759156990928-0a30e0fe1bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Social Media Kit',
    location: 'BINUS',
    category: 'Digital',
  },
  {
    id: '28',
    name: 'Kursus Online Digital Marketing Basic',
    price: 150000,
    rating: 4.9,
    reviewCount: 456,
    image:
      'https://images.unsplash.com/photo-1656360088907-5109c245851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU4NzY3OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Digital Academy',
    location: 'ITS',
    category: 'Digital',
    isNew: true,
  },
  {
    id: '29',
    name: 'Template CV ATS Friendly - 10 Design',
    price: 25000,
    rating: 4.6,
    reviewCount: 278,
    image:
      'https://images.unsplash.com/photo-1759156990928-0a30e0fe1bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Career Hub',
    location: 'UNPAD',
    category: 'Digital',
  },
  {
    id: '30',
    name: 'Plugin Wordpress Theme Customizer',
    price: 85000,
    originalPrice: 120000,
    rating: 4.7,
    reviewCount: 92,
    image:
      'https://images.unsplash.com/photo-1656360088907-5109c245851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU4NzY3OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Dev Tools',
    location: 'ITB',
    category: 'Digital',
  },
  {
    id: '31',
    name: 'Font Pack Indonesia - 50 Fonts',
    price: 40000,
    rating: 4.8,
    reviewCount: 156,
    image:
      'https://images.unsplash.com/photo-1759156990928-0a30e0fe1bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZGVzaWduJTIwdGVtcGxhdGV8ZW58MXx8fHwxNzY0MDQzMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Typography ID',
    location: 'UGM',
    category: 'Digital',
  },
  {
    id: '32',
    name: 'Preset Lightroom Mobile - Pack 20',
    price: 30000,
    rating: 4.5,
    reviewCount: 201,
    image:
      'https://images.unsplash.com/photo-1656360088907-5109c245851d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU4NzY3OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Photo Editor',
    location: 'UI',
    category: 'Digital',
  },

  // Minuman (keeping for variety)
  {
    id: '33',
    name: 'Kopi Robusta Premium - Biji Kopi Pilihan',
    price: 65000,
    rating: 4.9,
    reviewCount: 203,
    image:
      'https://images.unsplash.com/photo-1611888379005-6bbfae9cb745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmluayUyMGJldmVyYWdlfGVufDF8fHx8MTc2Mzk2MDYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    seller: 'Kopi Nusantara',
    location: 'UI',
    category: 'Makanan',
  },
];

export default function App() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const addToCart = (product: Product) => {
    if (!user) return setIsLoginOpen(true);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      else return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => setCartItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
  const removeCartItem = (id: string) => setCartItems((prev) => prev.filter((it) => it.id !== id));

  const cartItemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const promoProducts = mockProducts.filter((p) => p.originalPrice);

  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route
        path="/admin/*"
        element={<AdminApp />}
      />

      {/* Frontend Buyer */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-background">
            <Header
              cartItemCount={cartItemCount}
              onCartClick={() => setIsCartOpen(true)}
              onLoginClick={() => setIsLoginOpen(true)}
            />

            <main>
              <section id="beranda">
                <HeroSection />
              </section>
              <section id="promo">
                <PromoSection
                  products={promoProducts}
                  onAddToCart={addToCart}
                  onProductClick={addToCart}
                />
              </section>
              <section id="produk">
                <ProductGrid
                  products={mockProducts}
                  onAddToCart={addToCart}
                  onProductClick={addToCart}
                />
              </section>
            </main>

            <section id="tentang">
              <Footer />
            </section>

            <ShoppingCart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeCartItem}
            />

            <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />

            <Toaster />
          </div>
        }
      />
    </Routes>
  );
}
