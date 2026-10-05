import { BASE } from '../api.js';
import { colorForCategory } from '../categories.js';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return dateFormatter.format(new Date(y, m - 1, d));
}

export function ExpenseList({ expenses, onDelete, deletingId }) {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2>Все траты</h2>
        <p className="empty-state">Пока нет ни одной траты. Добавьте первую слева.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Все траты</h2>
        <a className="btn-export" href={`${BASE}/expenses/export`} download>
          Экспорт в CSV
        </a>
      </div>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id} className="expense-row">
            <span
              className="category-dot"
              style={{ background: colorForCategory(expense.category) }}
              aria-hidden="true"
            />
            <div className="expense-main">
              <div className="expense-top">
                <span className="expense-category">{expense.category}</span>
                <span className="expense-amount">{currencyFormatter.format(expense.amount)}</span>
              </div>
              <div className="expense-bottom">
                <span className="expense-date">{formatDate(expense.date)}</span>
                {expense.note && <span className="expense-note">{expense.note}</span>}
              </div>
            </div>
            <button
              type="button"
              className="btn-delete"
              onClick={() => onDelete(expense.id)}
              disabled={deletingId === expense.id}
              aria-label="Удалить трату"
              title="Удалить"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
