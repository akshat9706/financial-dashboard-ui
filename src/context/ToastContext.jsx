import { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const { toasts, toast } = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export const useToastCtx = () => useContext(ToastContext);

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-in flex items-center gap-3 bg-surface2 border border-white/[0.07]
                      rounded-field px-4 py-3.5 text-sm shadow-modal max-w-xs
                      ${t.type === 'success' ? 'border-success/20' : 'border-danger/20'}`}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.type === 'success' ? 'bg-success' : 'bg-danger'}`} />
          <span className="text-ink">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
