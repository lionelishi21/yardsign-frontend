import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isDisplayRoute = location.pathname === '/display';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Apply full screen styling for display route
  useEffect(() => {
    if (isDisplayRoute) {
      // Add full screen classes
      document.body.classList.add('display-fullscreen');
      document.documentElement.classList.add('display-fullscreen');
    } else {
      // Remove full screen classes
      document.body.classList.remove('display-fullscreen');
      document.documentElement.classList.remove('display-fullscreen');
    }

    return () => {
      // Cleanup when component unmounts
      document.body.classList.remove('display-fullscreen');
      document.documentElement.classList.remove('display-fullscreen');
    };
  }, [isDisplayRoute]);

  return (
    <div className={isDisplayRoute ? "h-screen w-screen" : "min-h-screen bg-gray-50"}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        
        {/* Display client route - always full screen */}
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
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
