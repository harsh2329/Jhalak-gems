const HEX: Record<string, string> = { Blue: '#2f6fd6', Yellow: '#e8b92e', Red: '#c8202f', Purple: '#7d3fc4', Green: '#1f9d62', Orange: '#ee7d2a', White: '#9aa7b4', Pink: '#e0668a' };
export function GemImage({ p }: { p: { image: string; name: string; colour: string } }) {
  if (p.image) return <img src={p.image} alt={p.name} />;
  const c = HEX[p.colour] ?? '#9a8f86';
  return <svg viewBox="0 0 100 100" role="img" aria-label={p.name}><rect width="100" height="100" fill={c} opacity=".13" /><polygon points="50,18 80,42 50,84 20,42" fill={c} /><polygon points="50,18 62,42 50,84 38,42" fill="#fff" opacity=".25" /><polygon points="20,42 50,18 80,42" fill="#fff" opacity=".18" /></svg>;
}
