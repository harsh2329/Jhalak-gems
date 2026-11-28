export const wa = (text: string) => `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || ''}?text=${encodeURIComponent(text)}`;
export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
