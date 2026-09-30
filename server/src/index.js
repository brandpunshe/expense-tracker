import express from 'express';
import cors from 'cors';
import { pool, initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateExpense(body) {
  const { amount, category, date, note } = body;

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return 'amount must be a positive number';
  }
  if (typeof category !== 'string' || category.trim().length === 0) {
    return 'category is required';
  }
  if (typeof date !== 'string' || !DATE_RE.test(date)) {
    return 'date must be in YYYY-MM-DD format';
  }
  if (note !== undefined && note !== null && typeof note !== 'string') {
    return 'note must be a string';
  }
  return null;
}

app.get('/api/expenses', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, amount, category, date, note FROM expenses ORDER BY date DESC, id DESC'
  );
  res.json(rows);
});

app.post('/api/expenses', async (req, res) => {
  const error = validateExpense(req.body || {});
  if (error) {
    return res.status(400).json({ error });
  }

  const { amount, category, date, note } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO expenses (amount, category, date, note)
     VALUES ($1, $2, $3, $4)
     RETURNING id, amount, category, date, note`,
    [amount, category.trim(), date, note ? note.trim() : '']
  );

  res.status(201).json(rows[0]);
});

app.delete('/api/expenses/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const { rows } = await pool.query('SELECT id FROM expenses WHERE id = $1', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'expense not found' });
  }

  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  res.status(204).send();
});

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

app.get('/api/expenses/export', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, amount, category, date, note FROM expenses ORDER BY date DESC, id DESC'
  );

  const header = ['Дата', 'Категория', 'Сумма', 'Заметка'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [csvEscape(row.date), csvEscape(row.category), csvEscape(row.amount), csvEscape(row.note)].join(',')
    );
  }
  const csv = '﻿' + lines.join('\r\n') + '\r\n';

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csv);
});

app.get('/api/stats', async (req, res) => {
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const {
    rows: [totalRow],
  } = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE date LIKE $1', [
    `${monthPrefix}-%`,
  ]);

  const { rows: byCategory } = await pool.query(
    `SELECT category, COALESCE(SUM(amount), 0) AS total
     FROM expenses
     WHERE date LIKE $1
     GROUP BY category
     ORDER BY total DESC`,
    [`${monthPrefix}-%`]
  );

  res.json({
    month: monthPrefix,
    total: totalRow.total,
    byCategory,
  });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Expense tracker API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
