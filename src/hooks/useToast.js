import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return { toasts, toast };
}

export function useSummary(transactions) {
  const income   = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;

  const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort();
  const lastM  = months[months.length - 1] || '';
  const prevM  = months[months.length - 2] || '';

  const expThisM = transactions.filter((t) => t.date.slice(0, 7) === lastM && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expPrevM = transactions.filter((t) => t.date.slice(0, 7) === prevM && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const expChange = expPrevM ? ((expThisM - expPrevM) / expPrevM * 100).toFixed(1) : 0;

  return { income, expenses, balance, savingsRate, expChange, lastM, prevM, expThisM, expPrevM };
}
