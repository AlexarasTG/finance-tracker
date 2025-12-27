import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import TransactionsView from './pages/TransactionsView.tsx';
import TransactionForm from './pages/TransactionForm.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-app via-app to-app-soft text-ink">
        <nav className="bg-app-soft border-b border-border-subtle backdrop-blur">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="text-lg font-semibold tracking-tight text-ink">Finance Lab</div>
            <ul className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => [
                    "px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-purple text-ink"
                      : "text-ink-soft hover:bg-surface hover:text-ink",
                  ].join(" ")}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) => [
                    "px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-purple text-ink"
                      : "text-ink-soft hover:bg-surface hover:text-ink",
                  ].join(" ")}
                >
                  Transactions
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/transaction/new"
                  className={({ isActive }) => [
                    "px-3 py-2 rounded-lg transition-colors font-semibold",
                    isActive
                      ? "bg-primary-purple text-ink"
                      : "bg-gradient-to-r from-primary-purple to-brand-green text-ink hover:from-primary-purple-deep hover:to-brand-green",
                  ].join(" ")}
                >
                  New Transaction
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsView />} />
            <Route path="/transaction/new" element={<TransactionForm />} />
            <Route path="/transaction/:id/edit" element={<TransactionForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
