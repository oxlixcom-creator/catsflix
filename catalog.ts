import {
  Shirt,
  Cpu,
  Gamepad2,
  Glasses,
  Home,
  Sparkles,
  Footprints,
  Watch,
  Briefcase,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  count: number;
};

export const categories: Category[] = [
  { id: 'fashion', name: 'Fashion', description: 'Tailored black garments for the bold', icon: Shirt, count: 248 },
  { id: 'technology', name: 'Technology', description: 'Devices engineered in obsidian', icon: Cpu, count: 96 },
  { id: 'gaming', name: 'Gaming', description: 'Play in the dark, win in style', icon: Gamepad2, count: 74 },
  { id: 'accessories', name: 'Accessories', description: 'The finishing touch of midnight', icon: Glasses, count: 312 },
  { id: 'home-decor', name: 'Home Decor', description: 'Sculpt your space in shadow', icon: Home, count: 128 },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Everyday essentials, reimagined', icon: Sparkles, count: 189 },
  { id: 'shoes', name: 'Shoes', description: 'Step into the abyss', icon: Footprints, count: 156 },
  { id: 'watches', name: 'Watches', description: 'Time, cast in black gold', icon: Watch, count: 64 },
  { id: 'bags', name: 'Bags', description: 'Carry the night with you', icon: Briefcase, count: 87 },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Noir Leather Trench',
    category: 'Fashion',
    price: 1890,
    rating: 4.9,
    reviews: 214,
    image: 'https://images.pexels.com/photos/27074950/pexels-photo-27074950.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
    tag: 'New',
  },
  {
    id: 'p2',
    name: 'Onyx Tourbillon Watch',
    category: 'Watches',
    price: 12400,
    rating: 5.0,
    reviews: 86,
    image: 'https://images.pexels.com/photos/22032442/pexels-photo-22032442.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
    tag: 'Limited',
  },
  {
    id: 'p3',
    name: 'Eclipse Wireless Headphones',
    category: 'Technology',
    price: 549,
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.pexels.com/photos/9154412/pexels-photo-9154412.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
  },
  {
    id: 'p4',
    name: 'Phantom Sneakers',
    category: 'Shoes',
    price: 320,
    rating: 4.7,
    reviews: 532,
    image: 'https://images.pexels.com/photos/12745055/pexels-photo-12745055.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
    tag: 'Trending',
  },
  {
    id: 'p5',
    name: 'Midnight Leather Bag',
    category: 'Bags',
    price: 1450,
    rating: 4.9,
    reviews: 178,
    image: 'https://images.pexels.com/photos/12373441/pexels-photo-12373441.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
  },
  {
    id: 'p6',
    name: 'Shadow Sunglasses',
    category: 'Accessories',
    price: 289,
    rating: 4.6,
    reviews: 342,
    image: 'https://images.pexels.com/photos/34467082/pexels-photo-34467082.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
  },
  {
    id: 'p7',
    name: 'Void Gaming Controller',
    category: 'Gaming',
    price: 199,
    rating: 4.8,
    reviews: 876,
    image: 'https://images.pexels.com/photos/9204697/pexels-photo-9204697.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
  },
  {
    id: 'p8',
    name: 'Coco Noir Parfum',
    category: 'Lifestyle',
    price: 175,
    rating: 4.9,
    reviews: 421,
    image: 'https://images.pexels.com/photos/21926650/pexels-photo-21926650.jpeg?auto=compress&cs=tinysrgb&h=900&w=600',
    tag: 'Bestseller',
  },
];
