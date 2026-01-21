import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SolvePage } from './pages/solve/SolvePage';
import { MySolutionsPage } from './pages/solutions/MySolutionsPage';
import { LandingPage } from './pages/landing/LandingPage';

// Styles
import './index.css';

function App() {
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="spinner spinner-lg"></div>
          <p>Loading System Design LMS...</p>
        </div>
        <style>{`
          .app-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
          }
          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-md);
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            }
          />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/solve/:id" element={<SolvePage />} />
            <Route path="/my-solutions" element={<MySolutionsPage />} />
          </Route>

          {/* Redirect */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
