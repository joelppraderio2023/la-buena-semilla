export type Category = "frutas" | "verduras" | "aceites" | "miel" | "condimentos";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  description: string;
  emoji: string;
  available: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  // Frutas
  { id: "manzana-roja", name: "Manzana Roja", category: "frutas", price: 0, unit: "kg", description: "Manzanas rojas frescas y jugosas", emoji: "🍎", available: true, featured: true },
  { id: "banana", name: "Banana", category: "frutas", price: 0, unit: "kg", description: "Bananas maduras de primera calidad", emoji: "🍌", available: true, featured: true },
  { id: "naranja", name: "Naranja", category: "frutas", price: 0, unit: "kg", description: "Naranjas dulces, ideales para jugo", emoji: "🍊", available: true },
  { id: "mandarina", name: "Mandarina", category: "frutas", price: 0, unit: "kg", description: "Mandarinas fáciles de pelar, muy dulces", emoji: "🍊", available: true },
  { id: "pera", name: "Pera Williams", category: "frutas", price: 0, unit: "kg", description: "Peras Williams suaves y dulces", emoji: "🍐", available: true },
  { id: "limon", name: "Limón", category: "frutas", price: 0, unit: "kg", description: "Limones frescos, ricos en vitamina C", emoji: "🍋", available: true },
  { id: "uva-blanca", name: "Uva Blanca", category: "frutas", price: 0, unit: "kg", description: "Uvas blancas dulces sin semilla", emoji: "🍇", available: true },
  { id: "frutilla", name: "Frutilla", category: "frutas", price: 0, unit: "kg", description: "Frutillas frescas de temporada", emoji: "🍓", available: true, featured: true },
  { id: "durazno", name: "Durazno", category: "frutas", price: 0, unit: "kg", description: "Duraznos dulces y jugosos de estación", emoji: "🍑", available: true },
  { id: "sandia", name: "Sandía", category: "frutas", price: 0, unit: "unidad", description: "Sandías frescas enteras", emoji: "🍉", available: true },

  // Verduras
  { id: "tomate", name: "Tomate Redondo", category: "verduras", price: 0, unit: "kg", description: "Tomates frescos para ensalada o cocción", emoji: "🍅", available: true, featured: true },
  { id: "lechuga", name: "Lechuga", category: "verduras", price: 0, unit: "unidad", description: "Lechuga fresca y crocante", emoji: "🥬", available: true },
  { id: "zanahoria", name: "Zanahoria", category: "verduras", price: 0, unit: "kg", description: "Zanahorias frescas y tiernas", emoji: "🥕", available: true },
  { id: "papa", name: "Papa", category: "verduras", price: 0, unit: "kg", description: "Papas blancas para hervir o freír", emoji: "🥔", available: true, featured: true },
  { id: "cebolla", name: "Cebolla", category: "verduras", price: 0, unit: "kg", description: "Cebollas blancas frescas", emoji: "🧅", available: true },
  { id: "ajo", name: "Ajo", category: "verduras", price: 0, unit: "cabeza", description: "Ajo fresco entero, sabor intenso", emoji: "🧄", available: true },
  { id: "zapallo", name: "Zapallo Anco", category: "verduras", price: 0, unit: "kg", description: "Zapallo anco fresco por porción", emoji: "🎃", available: true },
  { id: "brocoli", name: "Brócoli", category: "verduras", price: 0, unit: "unidad", description: "Brócoli fresco en cabezas", emoji: "🥦", available: true },
  { id: "espinaca", name: "Espinaca", category: "verduras", price: 0, unit: "atado", description: "Espinaca fresca en atados", emoji: "🌿", available: true },
  { id: "pimiento", name: "Pimiento Morrón", category: "verduras", price: 0, unit: "kg", description: "Pimientos rojos y verdes frescos", emoji: "🫑", available: true },

  // Aceites
  { id: "aceite-ev", name: "Aceite de Oliva Extra Virgen", category: "aceites", price: 0, unit: "500ml", description: "Primera presión en frío, sabor intenso y frutal", emoji: "🫒", available: true, featured: true },
  { id: "aceite-suave", name: "Aceite de Oliva Suave", category: "aceites", price: 0, unit: "500ml", description: "Aceite de oliva suave, ideal para cocinar", emoji: "🫒", available: true },

  // Miel
  { id: "miel-flores", name: "Miel de Flores", category: "miel", price: 0, unit: "500g", description: "Miel natural de flores silvestres, sin procesar", emoji: "🍯", available: true, featured: true },
  { id: "miel-silvestre", name: "Miel Silvestre", category: "miel", price: 0, unit: "250g", description: "Miel de abeja silvestre, sabor intenso y ahumado", emoji: "🍯", available: true },

  // Condimentos
  { id: "oregano", name: "Orégano", category: "condimentos", price: 0, unit: "50g", description: "Orégano seco y aromático, para pizzas y carnes", emoji: "🌿", available: true },
  { id: "pimienta-negra", name: "Pimienta Negra", category: "condimentos", price: 0, unit: "50g", description: "Pimienta negra molida de calidad", emoji: "🫙", available: true },
  { id: "aji-molido", name: "Ají Molido", category: "condimentos", price: 0, unit: "50g", description: "Ají molido picante artesanal", emoji: "🌶️", available: true, featured: true },
  { id: "pimenton", name: "Pimentón Dulce", category: "condimentos", price: 0, unit: "50g", description: "Pimentón dulce ahumado, color intenso", emoji: "🫙", available: true },
  { id: "comino", name: "Comino", category: "condimentos", price: 0, unit: "50g", description: "Comino molido para guisos y empanadas", emoji: "🫙", available: true },
  { id: "curcuma", name: "Cúrcuma", category: "condimentos", price: 0, unit: "50g", description: "Cúrcuma molida, antioxidante natural", emoji: "🫙", available: true },
];

export const categories = [
  { id: "todos", label: "Todos", emoji: "🛒" },
  { id: "frutas", label: "Frutas", emoji: "🍎" },
  { id: "verduras", label: "Verduras", emoji: "🥦" },
  { id: "aceites", label: "Aceites", emoji: "🫒" },
  { id: "miel", label: "Miel", emoji: "🍯" },
  { id: "condimentos", label: "Condimentos", emoji: "🌿" },
];

export const WHATSAPP_NUMBER = "5491158482772";
export const STORE_ADDRESS = "Moreno 3829, San Martín, Buenos Aires";
export const STORE_HOURS = "Lunes a Sábado, 8:00 – 20:00 hs";
