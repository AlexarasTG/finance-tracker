import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import TransactionsView from './pages/TransactionsView.tsx';
import TransactionForm from './pages/TransactionForm.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:bg-blue-700 p-2 rounded">Dashboard</Link></li>
            <li><Link to="/transactions" className="hover:bg-blue-700 p-2 rounded">Transactions</Link></li>
            <li><Link to="/transaction/new" className="hover:bg-blue-700 p-2 rounded">New Transaction</Link></li>
          </ul>
        </nav>
        <main className="p-4">
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
