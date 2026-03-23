export interface Product {
  id: number | string;
  name: string;
  category: string;
  subCategory?: string;
  gender: 'Hombre' | 'Mujer';
  price: number;
  image: string;
  occasion?: string[];
  description?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  code?: string;
  previousPrice?: number;
}

export const products: Product[] = [
  // Anillos - Hombre
  {
    id: 1,
    name: "Anillo Sello de Oro 18K",
    category: "Anillos",
    subCategory: "Sellos",
    gender: "Hombre",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1000&auto=format&fit=crop",
    occasion: ["graduaciones", "compromiso"],
    isFeatured: true
  },
  {
    id: 2,
    name: "Anillo de Tungsteno Negro",
    category: "Anillos",
    subCategory: "Bandas",
    gender: "Hombre",
    price: 450000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    occasion: ["matrimonio"]
  },
  // Anillos - Mujer
  {
    id: 3,
    name: "Anillo de Compromiso Solitario",
    category: "Anillos",
    subCategory: "Compromiso",
    gender: "Mujer",
    price: 4800000,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    occasion: ["compromiso", "matrimonio"],
    isFeatured: true,
    isNew: true
  },
  {
    id: 4,
    name: "Anillo Eternity Diamantes",
    category: "Anillos",
    subCategory: "Bandas",
    gender: "Mujer",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad5cb9ca?q=80&w=1000&auto=format&fit=crop",
    occasion: ["quinceanos", "matrimonio"]
  },
  // Pulseras - Hombre
  {
    id: 5,
    name: "Esclava de Oro Tejida",
    category: "Pulseras",
    subCategory: "Tejidas",
    gender: "Hombre",
    price: 3800000,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
    occasion: ["graduaciones"]
  },
  {
    id: 6,
    name: "Pulsera de Cuero y Oro",
    category: "Pulseras",
    subCategory: "Cuero",
    gender: "Hombre",
    price: 850000,
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1000&auto=format&fit=crop"
  },
  // Pulseras - Mujer
  {
    id: 7,
    name: "Pulsera de Balines de Oro",
    category: "Pulseras",
    subCategory: "Balines",
    gender: "Mujer",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe63c803?q=80&w=1000&auto=format&fit=crop",
    occasion: ["quinceanos"],
    isNew: true
  },
  {
    id: 8,
    name: "Tennis Bracelet Diamantes",
    category: "Pulseras",
    subCategory: "Diamantes",
    gender: "Mujer",
    price: 4950000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    occasion: ["matrimonio"]
  },
  // Cadenas - Hombre
  {
    id: 9,
    name: "Cadena Cubana 18K",
    category: "Cadenas",
    subCategory: "Tejidas",
    gender: "Hombre",
    price: 4200000,
    image: "https://images.unsplash.com/photo-1620921501515-389f4f46404d?q=80&w=1000&auto=format&fit=crop",
    isFeatured: true
  },
  // Aretes - Mujer
  {
    id: 10,
    name: "Candongas de Oro Grande",
    category: "Aretes",
    subCategory: "Candongas",
    gender: "Mujer",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Topos de Diamante",
    category: "Aretes",
    subCategory: "Topos",
    gender: "Mujer",
    price: 950000,
    image: "https://images.unsplash.com/photo-1635767798638-3e252cb3a824?q=80&w=1000&auto=format&fit=crop"
  },
  // Dijes
  {
    id: 12,
    name: "Dije Cruz de Oro",
    category: "Dijes",
    gender: "Mujer",
    price: 650000,
    image: "https://images.unsplash.com/photo-1612042718910-b99b531d054d?q=80&w=1000&auto=format&fit=crop"
  },
  // Piedras Preciosas
  {
    id: 13,
    name: "Esmeralda Certificada 1ct",
    category: "Piedras",
    subCategory: "Esmeraldas",
    gender: "Mujer",
    price: 4500000,
    image: "https://images.unsplash.com/photo-1615111784767-4d9a2d338166?q=80&w=1000&auto=format&fit=crop"
  },
  // Estuches
  {
    id: 14,
    name: "Estuche Premium Terciopelo",
    category: "Estuches",
    gender: "Mujer",
    price: 150000,
    image: "https://images.unsplash.com/photo-1598121622329-873d6e5a6669?q=80&w=1000&auto=format&fit=crop"
  }
];
