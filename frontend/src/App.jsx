import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Shared Components
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Loading from './components/Loading';

// Page Imports
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Lazy Loaded Admin Panel with React.lazy and Suspense (Task 2 Requirement)
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Shared Header & Navbar rendered throughout application */}
          <Header />
          <Navbar />

          {/* Main Routing Container */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Route: /order redirects unauthenticated users to / */}
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />

              {/* Lazy-Loaded & Admin Protected Route: /admin (Only for qwerty@gmail.com) */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<Loading message="Loading Admin Panel module..." />}>
                      <AdminPanel />
                    </Suspense>
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route
                path="*"
                element={
                  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>404 - Page Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
                      The requested route does not exist.
                    </p>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Shared Footer rendered throughout application */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
