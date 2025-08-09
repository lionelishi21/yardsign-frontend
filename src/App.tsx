import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { socketService } from './services/socket';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MenusPage from './pages/MenusPage';
import ItemsPage from './pages/ItemsPage';
import DisplaysPage from './pages/DisplaysPage';
import DisplayClient from './pages/DisplayClient';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth.tsx';

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } />
          
          {/* Display client route */}
          <Route path="/display" element={<DisplayClient />} />
          
          {/* Protected admin routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="displays" element={<DisplaysPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
