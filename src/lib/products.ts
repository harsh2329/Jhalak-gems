export type GemProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  colour: string;
  carat: number;
  shape: string;
  origin: string;
  treatment: string;
  certification: string;
  price: number;
  stock: number;
  image: string;
  model3d: string;
  description: string;
  featured?: boolean;
  trending?: boolean;
};

export const products: GemProduct[] = [
  {
    id: "1", sku: "JG-EM-0001", name: "Verdant Emerald", slug: "verdant-emerald",
    category: "Emerald", colour: "Green", carat: 3.25, shape: "Oval",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 18500, stock: 1,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000&q=85", model3d: "/models/emerald-demo.glb",
    description: "A striking green gemstone selected for its rich colour and elegant oval silhouette. Final stone specifications must be confirmed against the physical item.",
    featured: true, trending: true
  },
  {
    id: "2", sku: "JG-SA-0002", name: "Midnight Sapphire", slug: "midnight-sapphire",
    category: "Sapphire", colour: "Blue", carat: 2.10, shape: "Cushion",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 24500, stock: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=85", model3d: "/models/sapphire-demo.glb",
    description: "A deep blue sapphire-inspired catalogue entry. Replace this demo content with the exact stone's verified attributes.",
    featured: true
  },
  {
    id: "3", sku: "JG-RU-0003", name: "Ruby Ember", slug: "ruby-ember",
    category: "Ruby", colour: "Red", carat: 1.80, shape: "Oval",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 32000, stock: 1,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1000&q=85", model3d: "/models/ruby-demo.glb",
    description: "A vivid red gemstone catalogue concept. Confirm all physical product information before publishing.",
    trending: true
  },
  {
    id: "4", sku: "JG-AM-0004", name: "Amethyst Bloom", slug: "amethyst-bloom",
    category: "Amethyst", colour: "Purple", carat: 4.50, shape: "Pear",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 8900, stock: 3,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000&q=85", model3d: "/models/emerald-demo.glb",
    description: "A purple gemstone catalogue concept. Replace sample image and details with the actual item.",
  },
  {
    id: "5", sku: "JG-TO-0005", name: "Golden Topaz", slug: "golden-topaz",
    category: "Topaz", colour: "Yellow", carat: 5.20, shape: "Emerald cut",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 11200, stock: 2,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1000&q=85", model3d: "/models/ruby-demo.glb",
    description: "A warm golden gemstone catalogue concept. Verify the actual stone's properties before sale."
  },
  {
    id: "6", sku: "JG-OP-0006", name: "Ocean Blue Tourmaline", slug: "ocean-blue-tourmaline",
    category: "Tourmaline", colour: "Blue", carat: 2.75, shape: "Cushion",
    origin: "Origin to be verified", treatment: "Disclose per certificate",
    certification: "Certificate details on request", price: 27800, stock: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&q=85", model3d: "/models/sapphire-demo.glb",
    description: "A blue tourmaline catalogue concept. All data shown is placeholder content."
  }
];
