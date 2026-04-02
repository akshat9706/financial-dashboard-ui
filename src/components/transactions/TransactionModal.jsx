import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToastCtx } from '../../context/ToastContext';
import { CATEGORIES } from '../../data/transactions';

const EMPTY = { description: '', amount: '', date: '', type: 'expense', category: 'Food' };

export default function TransactionModal() {
  const { state, actions } = useApp();
  const toast = useToastCtx();
  const { modal, transactions } = state;

  const editTx = modal.editId ? transactions.find((t) => t.id === modal.editId) : null;
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (modal.open) {
      setForm(editTx
        ? { description: editTx.description, amount: editTx.amount, date: editTx.date, type: editTx.type, category: editTx.category }
        : { ...EMPTY, date: new Date().toISOString().split('T')[0] }
      );
    }
  }, [modal.open, modal.editId]);

  // Update category when type changes (if current cat not valid for new type)
  useEffect(() => {
    if (!CATEGORIES[form.type]?.includes(form.category)) {
      setForm((f) => ({ ...f, category: CATEGORIES[form.type][0] }));
    }
  }, [form.type]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim()) { toast('Description is required', 'error'); return; }
    if (!form.amount || Number(form.amount) <= 0) { toast('Enter a valid amount', 'error'); return; }
    if (!form.date) { toast('Date is required', 'error'); return; }

    const tx = {
      description: form.description.trim(),
      amount: Number(form.amount),
      date: form.date,
      type: form.type,
      category: form.category,
    };

    if (editTx) {
      actions.updateTx({ ...tx, id: editTx.id });
      toast('Transaction updated', 'success');
    } else {
      actions.addTx(tx);
      toast('Transaction added', 'success');
    }
    actions.closeModal();
  };

  if (!modal.open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && actions.closeModal()}
    >
      <div className="bg-surface border border-white/[0.07] rounded-card p-8 w-full max-w-md shadow-modal
                      animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-head text-2xl text-ink">
            {editTx ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={actions.closeModal} className="btn-icon">
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="form-label">Description</label>
            <input
              className="form-field"
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-field"
                type="number"
                min="0"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                className="form-field"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-field cursor-pointer"
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-field cursor-pointer"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {(CATEGORIES[form.type] || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 mt-7">
          <button onClick={actions.closeModal} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} className="btn-primary">
            {editTx ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
