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
  { id: "manzana-roja",       name: "Manzana Roja",       category: "frutas",  price: 0,     unit: "kg",      description: "Manzanas rojas frescas y jugosas",              emoji: "🍎", available: true, featured: true },
  { id: "banana",             name: "Banana",             category: "frutas",  price: 0,     unit: "kg",      description: "Bananas maduras de primera calidad",            emoji: "🍌", available: true, featured: true },
  { id: "naranja",            name: "Naranja",            category: "frutas",  price: 0,     unit: "kg",      description: "Naranjas dulces, ideales para jugo",            emoji: "🍊", available: true },
  { id: "mandarina",          name: "Mandarina",          category: "frutas",  price: 0,     unit: "kg",      description: "Mandarinas fáciles de pelar, muy dulces",       emoji: "🍊", available: true },
  { id: "pera",               name: "Pera Williams",      category: "frutas",  price: 0,     unit: "kg",      description: "Peras Williams suaves y dulces",                emoji: "🍐", available: true },
  { id: "limon",              name: "Limón",              category: "frutas",  price: 0,     unit: "kg",      description: "Limones frescos, ricos en vitamina C",          emoji: "🍋", available: true },
  { id: "uva-blanca",         name: "Uva Blanca",         category: "frutas",  price: 0,     unit: "kg",      description: "Uvas blancas dulces sin semilla",               emoji: "🍇", available: true },
  { id: "frutilla",           name: "Frutilla",           category: "frutas",  price: 0,     unit: "kg",      description: "Frutillas frescas de temporada",                emoji: "🍓", available: true, featured: true },
  { id: "durazno",            name: "Durazno",            category: "frutas",  price: 0,     unit: "kg",      description: "Duraznos dulces y jugosos de estación",         emoji: "🍑", available: true },
  { id: "sandia",             name: "Sandía",             category: "frutas",  price: 0,     unit: "unidad",  description: "Sandías frescas enteras",                       emoji: "🍉", available: true },
  { id: "platano",            name: "Plátano",            category: "frutas",  price: 4000,  unit: "kg",      description: "Plátanos maduros, cremosos y dulces",           emoji: "🍌", available: true },
  { id: "palta",              name: "Palta",              category: "frutas",  price: 2500,  unit: "unidad",  description: "Paltas frescas, perfectas para guacamole",      emoji: "🥑", available: true, featured: true },
  { id: "melon",              name: "Melón",              category: "frutas",  price: 8000,  unit: "unidad",  description: "Melones dulces y jugosos de temporada",         emoji: "🍈", available: true },
  { id: "ciruela",            name: "Ciruela",            category: "frutas",  price: 5000,  unit: "kg",      description: "Ciruelas frescas, dulces y jugosas",            emoji: "🍑", available: true },
  { id: "arandano",           name: "Arándano",           category: "frutas",  price: 10000, unit: "caja",    description: "Arándanos frescos, ricos en antioxidantes",     emoji: "🫐", available: true },
  { id: "kiwi",               name: "Kiwi",               category: "frutas",  price: 10000, unit: "kg",      description: "Kiwis frescos, llenos de vitamina C",           emoji: "🥝", available: true },
  { id: "pomelo",             name: "Pomelo",             category: "frutas",  price: 3000,  unit: "kg",      description: "Pomelos frescos, cítricos y refrescantes",      emoji: "🍊", available: true },
  { id: "anana",              name: "Ananá",              category: "frutas",  price: 4000,  unit: "unidad",  description: "Ananás tropicales dulces y aromáticos",         emoji: "🍍", available: true },
  { id: "papaya-brasilera",   name: "Papaya Brasilera",   category: "frutas",  price: 9000,  unit: "unidad",  description: "Papaya brasilera grande, dulce y tropical",     emoji: "🌴", available: true },
  { id: "papaya",             name: "Papaya",             category: "frutas",  price: 6000,  unit: "unidad",  description: "Papaya fresca, digestiva y sabrosa",            emoji: "🍈", available: true },
  { id: "mango",              name: "Mango",              category: "frutas",  price: 3000,  unit: "unidad",  description: "Mangos tropicales dulces y aromáticos",         emoji: "🥭", available: true },
  { id: "cereza",             name: "Cereza",             category: "frutas",  price: 10000, unit: "kg",      description: "Cerezas frescas de temporada, muy dulces",      emoji: "🍒", available: true },
  { id: "lima",               name: "Lima",               category: "frutas",  price: 5500,  unit: "kg",      description: "Limas frescas, perfectas para tragos y cocina", emoji: "🍋", available: true },

  // Verduras
  { id: "tomate",             name: "Tomate Redondo",     category: "verduras", price: 0,    unit: "kg",      description: "Tomates frescos para ensalada o cocción",       emoji: "🍅", available: true, featured: true },
  { id: "lechuga",            name: "Lechuga",            category: "verduras", price: 0,    unit: "kg",      description: "Lechuga fresca y crocante",                     emoji: "🥬", available: true },
  { id: "zanahoria",          name: "Zanahoria",          category: "verduras", price: 0,    unit: "kg",      description: "Zanahorias frescas y tiernas",                  emoji: "🥕", available: true },
  { id: "papa",               name: "Papa",               category: "verduras", price: 0,    unit: "kg",      description: "Papas blancas para hervir o freír",             emoji: "🥔", available: true, featured: true },
  { id: "cebolla",            name: "Cebolla",            category: "verduras", price: 0,    unit: "kg",      description: "Cebollas blancas frescas",                      emoji: "🧅", available: true },
  { id: "ajo",                name: "Ajo",                category: "verduras", price: 0,    unit: "cabeza",  description: "Ajo fresco entero, sabor intenso",              emoji: "🧄", available: true },
  { id: "zapallo",            name: "Zapallo Anco",       category: "verduras", price: 0,    unit: "kg",      description: "Zapallo anco fresco por porción",               emoji: "🎃", available: true },
  { id: "brocoli",            name: "Brócoli",            category: "verduras", price: 0,    unit: "unidad",  description: "Brócoli fresco en cabezas",                     emoji: "🥦", available: true },
  { id: "espinaca",           name: "Espinaca",           category: "verduras", price: 0,    unit: "atado",   description: "Espinaca fresca en atados",                     emoji: "🌿", available: true },
  { id: "pimiento",           name: "Pimiento Morrón",    category: "verduras", price: 0,    unit: "kg",      description: "Pimientos rojos y verdes frescos",              emoji: "🫑", available: true },
  { id: "acelga",             name: "Acelga",             category: "verduras", price: 1500, unit: "paquete", description: "Acelga fresca en paquete, ideal para sopas",    emoji: "🥬", available: true },
  { id: "remolacha",          name: "Remolacha",          category: "verduras", price: 2000, unit: "paquete", description: "Remolachas frescas, dulces y nutritivas",        emoji: "🫛", available: true },
  { id: "coliflor",           name: "Coliflor",           category: "verduras", price: 3000, unit: "unidad",  description: "Coliflor fresco en cabeza, versátil y sabroso", emoji: "🥦", available: true },
  { id: "repollo",            name: "Repollo",            category: "verduras", price: 2500, unit: "kg",      description: "Repollo fresco, ideal para ensaladas y guisos", emoji: "🥬", available: true },
  { id: "morron-verde",       name: "Morrón Verde",       category: "verduras", price: 3000, unit: "kg",      description: "Morrones verdes frescos y crocantes",           emoji: "🫑", available: true },
  { id: "morron-amarillo",    name: "Morrón Amarillo",    category: "verduras", price: 5000, unit: "kg",      description: "Morrones amarillos dulces y coloridos",         emoji: "🫑", available: true },
  { id: "berenjena",          name: "Berenjena",          category: "verduras", price: 3000, unit: "kg",      description: "Berenjenas frescas, perfectas para el horno",   emoji: "🍆", available: true },
  { id: "tomate-perita",      name: "Tomate Perita",      category: "verduras", price: 2000, unit: "kg",      description: "Tomates perita, ideales para salsas caseras",   emoji: "🍅", available: true },
  { id: "tomate-cherry",      name: "Tomate Cherry",      category: "verduras", price: 6000, unit: "kg",      description: "Tomates cherry dulces, perfectos para ensalada", emoji: "🍅", available: true },
  { id: "cebolla-verdeo",     name: "Cebolla de Verdeo",  category: "verduras", price: 6000, unit: "kg",      description: "Cebolla de verdeo fresca, sabor suave",         emoji: "🌱", available: true },
  { id: "puerro",             name: "Puerro",             category: "verduras", price: 6000, unit: "kg",      description: "Puerros frescos, ideales para sopas y tartas",  emoji: "🌱", available: true },
  { id: "perejil",            name: "Perejil",            category: "verduras", price: 6000, unit: "kg",      description: "Perejil fresco y aromático",                    emoji: "🌿", available: true },
  { id: "zapallito",          name: "Zapallito",          category: "verduras", price: 4000, unit: "kg",      description: "Zapallitos tiernos, ideales para saltear",      emoji: "🥒", available: true },
  { id: "zukini",             name: "Zukini",             category: "verduras", price: 4000, unit: "kg",      description: "Zukinis frescos, versátiles en la cocina",      emoji: "🥒", available: true },
  { id: "rucula",             name: "Rúcula",             category: "verduras", price: 1000, unit: "paquete", description: "Rúcula fresca y picante, ideal para ensaladas",  emoji: "🌿", available: true },
  { id: "radicheta",          name: "Radicheta",          category: "verduras", price: 1000, unit: "paquete", description: "Radicheta fresca, ligeramente amarga",          emoji: "🌿", available: true },
  { id: "pepino",             name: "Pepino",             category: "verduras", price: 2000, unit: "kg",      description: "Pepinos frescos y crocantes",                   emoji: "🥒", available: true },
  { id: "kale",               name: "Kale",               category: "verduras", price: 2500, unit: "paquete", description: "Kale fresco, superalimento nutritivo",          emoji: "🥬", available: true },
  { id: "papa-blanca",        name: "Papa Blanca",        category: "verduras", price: 2000, unit: "kg",      description: "Papas blancas frescas para hervir o freír",     emoji: "🥔", available: true },
  { id: "batata",             name: "Batata",             category: "verduras", price: 2000, unit: "kg",      description: "Batatas dulces y nutritivas",                   emoji: "🍠", available: true },
  { id: "batata-boniato",     name: "Batata Boniato",     category: "verduras", price: 3500, unit: "kg",      description: "Boniato dulce, ideal asado o en puré",          emoji: "🍠", available: true },
  { id: "ciboulette",         name: "Ciboulette",         category: "verduras", price: 4000, unit: "paquete", description: "Ciboulette fresco, sabor suave a cebolla",      emoji: "🌿", available: true },
  { id: "papin",              name: "Papín",              category: "verduras", price: 3500, unit: "kg",      description: "Papines pequeños y tiernos, muy sabrosos",      emoji: "🥔", available: true },
  { id: "menta",              name: "Menta",              category: "verduras", price: 3500, unit: "paquete", description: "Menta fresca y aromática",                      emoji: "🌿", available: true },
  { id: "zapallo-cabutia",    name: "Zapallo Cabutia",    category: "verduras", price: 2500, unit: "kg",      description: "Zapallo cabutia, dulce y cremoso",              emoji: "🎃", available: true },
  { id: "cebolla-morada",     name: "Cebolla Morada",     category: "verduras", price: 3000, unit: "kg",      description: "Cebolla morada suave, ideal para ensaladas",    emoji: "🧅", available: true },
  { id: "albahaca",           name: "Albahaca",           category: "verduras", price: 2000, unit: "paquete", description: "Albahaca fresca y aromática",                   emoji: "🌿", available: true },
  { id: "choclo",             name: "Choclo",             category: "verduras", price: 1500, unit: "unidad",  description: "Choclos frescos y tiernos",                     emoji: "🌽", available: true },
  { id: "chaucha",            name: "Chaucha",            category: "verduras", price: 6000, unit: "kg",      description: "Chauchas frescas y tiernas",                    emoji: "🫛", available: true },
  { id: "hinojo",             name: "Hinojo",             category: "verduras", price: 1500, unit: "unidad",  description: "Hinojo fresco, sabor anisado",                  emoji: "🌿", available: true },
  { id: "apio",               name: "Apio",               category: "verduras", price: 3000, unit: "unidad",  description: "Apio fresco, crocante y sabroso",               emoji: "🌿", available: true },
  { id: "esparrago",          name: "Espárrago",          category: "verduras", price: 9000, unit: "atado",   description: "Espárragos frescos, ideales a la plancha",      emoji: "🌱", available: true },
  { id: "alcaucil",           name: "Alcaucil",           category: "verduras", price: 5000, unit: "unidad",  description: "Alcauciles frescos, tiernos y sabrosos",        emoji: "🌸", available: true },

  // Aceites
  { id: "aceite-ev",    name: "Aceite de Oliva Extra Virgen", category: "aceites", price: 0, unit: "500ml", description: "Primera presión en frío, sabor intenso y frutal",    emoji: "🫒", available: true, featured: true },
  { id: "aceite-suave", name: "Aceite de Oliva Suave",        category: "aceites", price: 0, unit: "500ml", description: "Aceite de oliva suave, ideal para cocinar",           emoji: "🫒", available: true },

  // Miel
  { id: "miel-1kg",  name: "Miel", category: "miel", price: 0, unit: "1kg",  description: "Miel natural pura, sin procesar", emoji: "🍯", available: true, featured: true },
  { id: "miel-500g", name: "Miel", category: "miel", price: 0, unit: "500g", description: "Miel natural pura, sin procesar", emoji: "🍯", available: true },

  // Condimentos
  { id: "oregano",       name: "Orégano",       category: "condimentos", price: 0, unit: "50g", description: "Orégano seco y aromático, para pizzas y carnes",   emoji: "🌿", available: true },
  { id: "pimienta-negra",name: "Pimienta Negra",category: "condimentos", price: 0, unit: "50g", description: "Pimienta negra molida de calidad",                 emoji: "🫙", available: true },
  { id: "aji-molido",    name: "Ají Molido",    category: "condimentos", price: 0, unit: "50g", description: "Ají molido picante artesanal",                     emoji: "🌶️", available: true, featured: true },
  { id: "pimenton",      name: "Pimentón Dulce",category: "condimentos", price: 0, unit: "50g", description: "Pimentón dulce ahumado, color intenso",            emoji: "🫙", available: true },
  { id: "comino",        name: "Comino",        category: "condimentos", price: 0, unit: "50g", description: "Comino molido para guisos y empanadas",            emoji: "🫙", available: true },
  { id: "curcuma",       name: "Cúrcuma",       category: "condimentos", price: 0, unit: "50g", description: "Cúrcuma molida, antioxidante natural",             emoji: "🫙", available: true },
];

export const categories = [
  { id: "todos",       label: "Todos",       emoji: "🛒" },
  { id: "frutas",      label: "Frutas",      emoji: "🍎" },
  { id: "verduras",    label: "Verduras",    emoji: "🥦" },
  { id: "aceites",     label: "Aceites",     emoji: "🫒" },
  { id: "miel",        label: "Miel",        emoji: "🍯" },
  { id: "condimentos", label: "Condimentos", emoji: "🌿" },
];

export const WHATSAPP_NUMBER = "5491158482772";
export const STORE_ADDRESS   = "Moreno 3829, San Martín, Buenos Aires";
export const STORE_HOURS     = "Pedidos: 9:00 – 16:00 hs · Entregas: 18:00 – 20:00 hs";
