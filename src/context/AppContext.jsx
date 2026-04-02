import { createContext, useContext, useReducer, useEffect } from 'react';
import { SEED_TRANSACTIONS } from '../data/transactions';

const AppContext = createContext(null);

const ACTIONS = {
  SET_ROLE:       'SET_ROLE',
  SET_VIEW:       'SET_VIEW',
  SET_PERIOD:     'SET_PERIOD',
  SET_FILTERS:    'SET_FILTERS',
  SET_SORT:       'SET_SORT',
  ADD_TX:         'ADD_TX',
  UPDATE_TX:      'UPDATE_TX',
  DELETE_TX:      'DELETE_TX',
  OPEN_MODAL:     'OPEN_MODAL',
  CLOSE_MODAL:    'CLOSE_MODAL',
};

function loadTransactions() {
  try {
    const saved = localStorage.getItem('ledger_transactions');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  } catch {
    return SEED_TRANSACTIONS;
  }
}

const initialState = {
  role:         'admin',
  view:         'dashboard',
  period:       '3m',
  transactions: loadTransactions(),
  filters:      { search: '', type: '', category: '', month: '' },
  sort:         { key: 'date', dir: -1 },
  modal:        { open: false, editId: null },
  nextId:       null,
};
initialState.nextId = initialState.transactions.reduce((m, t) => Math.max(m, t.id), 0) + 1;

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };

    case ACTIONS.SET_VIEW:
      return { ...state, view: action.payload };

    case ACTIONS.SET_PERIOD:
      return { ...state, period: action.payload };

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTIONS.SET_SORT: {
      const key = action.payload;
      const dir = state.sort.key === key ? state.sort.dir * -1 : -1;
      return { ...state, sort: { key, dir } };
    }

    case ACTIONS.ADD_TX: {
      const tx = { ...action.payload, id: state.nextId };
      return { ...state, transactions: [...state.transactions, tx], nextId: state.nextId + 1 };
    }

    case ACTIONS.UPDATE_TX:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case ACTIONS.DELETE_TX:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case ACTIONS.OPEN_MODAL:
      return { ...state, modal: { open: true, editId: action.payload ?? null } };

    case ACTIONS.CLOSE_MODAL:
      return { ...state, modal: { open: false, editId: null } };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ledger_transactions', JSON.stringify(state.transactions));
    } catch {}
  }, [state.transactions]);

  const actions = {
    setRole:    (role)    => dispatch({ type: ACTIONS.SET_ROLE, payload: role }),
    setView:    (view)    => dispatch({ type: ACTIONS.SET_VIEW, payload: view }),
    setPeriod:  (period)  => dispatch({ type: ACTIONS.SET_PERIOD, payload: period }),
    setFilters: (filters) => dispatch({ type: ACTIONS.SET_FILTERS, payload: filters }),
    setSort:    (key)     => dispatch({ type: ACTIONS.SET_SORT, payload: key }),
    addTx:      (tx)      => dispatch({ type: ACTIONS.ADD_TX, payload: tx }),
    updateTx:   (tx)      => dispatch({ type: ACTIONS.UPDATE_TX, payload: tx }),
    deleteTx:   (id)      => dispatch({ type: ACTIONS.DELETE_TX, payload: id }),
    openModal:  (id)      => dispatch({ type: ACTIONS.OPEN_MODAL, payload: id }),
    closeModal: ()        => dispatch({ type: ACTIONS.CLOSE_MODAL }),
  };

  // Derived: filtered + sorted transactions
  const getFiltered = () => {
    const { search, type, category, month } = state.filters;
    return state.transactions
      .filter((t) => {
        if (search && !t.description.toLowerCase().includes(search.toLowerCase()) &&
            !t.category.toLowerCase().includes(search.toLowerCase())) return false;
        if (type && t.type !== type) return false;
        if (category && t.category !== category) return false;
        if (month && t.date.slice(0, 7) !== month) return false;
        return true;
      })
      .sort((a, b) => {
        const va = a[state.sort.key];
        const vb = b[state.sort.key];
        if (typeof va === 'string') return va.localeCompare(vb) * state.sort.dir;
        return (va - vb) * state.sort.dir;
      });
  };

  return (
    <AppContext.Provider value={{ state, actions, getFiltered }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
