export type GemProduct = {
  id: string; sku: string; name: string; slug: string; category: string; colour: string;
  carat: number; shape: string; origin: string; treatment: string; clarity: string;
  certification: string; certificateNo: string; price: number; stock: number; image: string;
  description: string; featured?: boolean; trending?: boolean; status?: string; model3d?: string;
};

// Placeholder catalogue (the six Infinity Stones). Replace with real inventory from /admin.
const g = (n: number, name: string, category: string, colour: string, carat: number, shape: string, origin: string, treatment: string, clarity: string, price: number): GemProduct => ({
  id: String(n), sku: `JG-${String(n).padStart(4, '0')}`, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  category, colour, carat, shape, origin, treatment, clarity, certification: '', certificateNo: '', price, stock: 1, image: '',
  description: 'Placeholder stone for the demo catalogue. Replace with verified details and a real photo from the admin panel.', featured: true
});

export const products: GemProduct[] = [
  g(1, 'Space Stone', 'Blue Sapphire', 'Blue', 7.12, 'Cushion', 'Sri Lanka', 'Heated', 'VVS', 125000),
  g(2, 'Mind Stone', 'Yellow Sapphire', 'Yellow', 5.4, 'Oval', 'Sri Lanka', 'Heated', 'VS', 64000),
  g(3, 'Reality Stone', 'Ruby', 'Red', 4.86, 'Oval', 'Mozambique', 'Heated', 'VS', 185000),
  g(4, 'Power Stone', 'Amethyst', 'Purple', 9.2, 'Emerald cut', 'Zambia', 'Unheated', 'VVS', 9500),
  g(5, 'Time Stone', 'Emerald', 'Green', 6.03, 'Emerald cut', 'Colombia', 'Minor oil', 'VS', 142000),
  g(6, 'Soul Stone', 'Garnet', 'Orange', 3.75, 'Round', 'Namibia', 'Unheated', 'VVS', 38000)
];
