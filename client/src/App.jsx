import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';
import { ExpenseForm } from './components/ExpenseForm.jsx';
import { ExpenseList } from './components/ExpenseList.jsx';
import { StatsPanel } from './components/StatsPanel.jsx';
import './App.css';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [expensesData, statsData] = await Promise.all([api.getExpenses(), api.getStats()]);
      setExpenses(expensesData);
      setStats(statsData);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCreate = async (expense) => {
    setSubmitting(true);
    try {
      await api.createExpense(expense);
      await loadAll();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.deleteExpense(id);
      await loadAll();
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Трекер расходов</h1>
      </header>

      {loadError && <div className="banner-error">{loadError}</div>}

      {loading ? (
        <p className="loading-state">Загрузка…</p>
      ) : (
        <>
          <StatsPanel stats={stats} />
          <div className="main-grid">
            <ExpenseForm onSubmit={handleCreate} submitting={submitting} />
            <ExpenseList expenses={expenses} onDelete={handleDelete} deletingId={deletingId} />
          </div>
        </>
      )}
    </div>
  );
}
