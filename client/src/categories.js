// Fixed category list mapped 1:1 to the validated categorical palette slots
// (order matters for colorblind-safe adjacent contrast — do not reorder).
export const CATEGORIES = [
  { name: 'Еда', color: 'var(--series-1)' },
  { name: 'Транспорт', color: 'var(--series-2)' },
  { name: 'Жильё', color: 'var(--series-3)' },
  { name: 'Развлечения', color: 'var(--series-4)' },
  { name: 'Здоровье', color: 'var(--series-5)' },
  { name: 'Покупки', color: 'var(--series-6)' },
  { name: 'Коммунальные услуги', color: 'var(--series-7)' },
  { name: 'Другое', color: 'var(--series-8)' },
];

const COLOR_BY_NAME = new Map(CATEGORIES.map((c) => [c.name, c.color]));

export function colorForCategory(name) {
  return COLOR_BY_NAME.get(name) || 'var(--series-8)';
}
