const q = (c: string) => `/shop?category=${encodeURIComponent(c)}`;
const rashi: [string, string][] = [['Mesh', 'Red Coral'], ['Vrishabh', 'Diamond'], ['Mithun', 'Emerald'], ['Kark', 'Pearl'], ['Singh', 'Ruby'], ['Kanya', 'Emerald'], ['Tula', 'Diamond'], ['Vrishchik', 'Red Coral'], ['Dhanu', 'Yellow Sapphire'], ['Makar', 'Blue Sapphire'], ['Kumbh', 'Blue Sapphire'], ['Meen', 'Yellow Sapphire']];
export const NAVRATNA = ['Yellow Sapphire', 'Blue Sapphire', 'Emerald', 'Ruby', 'Pearl', 'Red Coral', 'Hessonite', 'Cat’s Eye', 'Diamond'];
export const MENU: { label: string; cols: { h: string; links: [string, string][] }[] }[] = [
  { label: 'Gemstones', cols: [
    { h: 'Navratna', links: NAVRATNA.map(n => [n, q(n)] as [string, string]) },
    { h: 'Upratna', links: ['Amethyst', 'Citrine', 'Garnet', 'Peridot', 'Opal', 'Tourmaline'].map(n => [n, q(n)] as [string, string]) },
    { h: 'By price', links: [['Under ₹10,000', '/shop?max=10000'], ['Under ₹50,000', '/shop?max=50000'], ['Under ₹1,00,000', '/shop?max=100000'], ['All stones', '/shop']] }] },
  { label: 'Rashi', cols: [{ h: 'By moon sign', links: rashi.map(([r, s]) => [`${r} · ${s}`, q(s)] as [string, string]) }] },
  { label: 'Certified', cols: [{ h: 'Proof', links: [['Certified stones', '/shop?cert=y'], ['Check a report number', '/certificate']] }] }
];
