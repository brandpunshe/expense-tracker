import { colorForCategory } from '../categories.js';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });

function monthLabel(monthKey) {
  if (!monthKey) return '';
  const [y, m] = monthKey.split('-').map(Number);
  const label = monthFormatter.format(new Date(y, m - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function StatsPanel({ stats }) {
  if (!stats) return null;

  const { total, byCategory, month } = stats;
  const max = byCategory.reduce((acc, c) => Math.max(acc, c.total), 0);

  return (
    <div className="stats-row">
      <div className="card stat-tile">
        <span className="stat-label">Всего за {monthLabel(month)}</span>
        <span className="stat-value">{currencyFormatter.format(total)}</span>
      </div>

      <div className="card category-breakdown">
        <h2>По категориям</h2>
        {byCategory.length === 0 ? (
          <p className="empty-state">В этом месяце трат ещё нет.</p>
        ) : (
          <ul className="bar-list">
            {byCategory.map((c) => (
              <li key={c.category} className="bar-row">
                <span className="bar-label">{c.category}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${max > 0 ? (c.total / max) * 100 : 0}%`,
                      background: colorForCategory(c.category),
                    }}
                  />
                </div>
                <span className="bar-value">{currencyFormatter.format(c.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
