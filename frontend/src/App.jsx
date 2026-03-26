import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TaskList from './pages/TaskList';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-8 text-center text-secondary">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="btn-outline text-sm py-1.5 px-3">
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

const TopBar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md border-b border-slate-200 dark:border-darkborder px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        <span>Task Manager</span>
        {user && (
          <div className="flex gap-4 text-sm font-medium text-slate-700 dark:text-slate-300 items-center">
            <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/tasks" className="hover:text-primary transition-colors">View Tasks</Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <button onClick={logout} className="btn-outline text-sm py-1.5 px-3">Logout</button>
        )}
      </div>
    </nav>
  );
};

function AppRoutes() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="pb-12">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
