import { useState } from 'react';
import { CATEGORIES } from '../categories.js';

const today = () => new Date().toISOString().slice(0, 10);

export function ExpenseForm({ onSubmit, submitting }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [date, setDate] = useState(today);
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Введите сумму больше нуля');
      return;
    }
    if (!date) {
      setError('Укажите дату');
      return;
    }

    try {
      await onSubmit({ amount: parsedAmount, category, date, note });
      setAmount('');
      setNote('');
      setDate(today());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Новая трата</h2>

      <div className="field">
        <label htmlFor="amount">Сумма</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Категория</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="date">Дата</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="note">Заметка</label>
        <input
          id="note"
          type="text"
          placeholder="Необязательно"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Добавление…' : 'Добавить трату'}
      </button>
    </form>
  );
}
