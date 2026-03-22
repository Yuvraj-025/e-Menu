import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Placeholder Pages
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <div className="app">
              <Navbar />
              <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
