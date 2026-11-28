export const fileToUrl = (f: File, max: number) => new Promise<string>(res => {
  const i = new Image();
  i.onload = () => { const k = Math.min(1, max / Math.max(i.width, i.height)); const c = document.createElement('canvas'); c.width = i.width * k; c.height = i.height * k; c.getContext('2d')!.drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.8)); };
  i.src = URL.createObjectURL(f);
});
