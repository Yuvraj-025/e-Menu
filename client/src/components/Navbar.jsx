import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems, getCartCount, getCartTotal, removeFromCart, clearCart } = useCart();
  const { userInfo, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close cart when navigating
  useEffect(() => {
    setCartOpen(false);
  }, [location.pathname]);

  return (
    <nav className={scrolled ? 'scrolled' : ''} aria-label="Primary">
      <Link to="/" className="logo">{settings?.cafeName || 'Coffee Shop'}</Link>
      <ul>
        <li><Link to="/menu">Menu</Link></li>
        <li><a href="#contact">Contact</a></li>
        {userInfo ? (
          <>
            <li><Link to="/admin/dashboard" className="admin-link">Admin</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/admin/login" className="admin-link"><i className="fal fa-user"></i></Link></li>
        )}
        
        <li className="cart-nav">
          <button 
            id="cart-toggle" 
            aria-expanded={cartOpen} 
            onClick={() => setCartOpen(!cartOpen)}
            title="Open cart"
          >
            <i className="fal fa-shopping-cart cart" aria-hidden="true"></i>
            <span className="cart-count" aria-live="polite">{getCartCount()}</span>
          </button>
          
          <div className={`cart-dropdown ${cartOpen ? 'open' : ''}`} id="cart-panel" role="dialog">
            <h4>Your Cart</h4>
            <ul className="cart-list">
              {cartItems.length === 0 ? (
                <p className="cart-empty">Cart is empty</p>
              ) : (
                cartItems.map(item => (
                  <li key={item._id} className="cart-item">
                    <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} className="cart-thumb" />
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-qty">× {item.quantity}</span>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button className="remove-item" onClick={() => removeFromCart(item._id)}>&times;</button>
                  </li>
                ))
              )}
            </ul>
            {cartItems.length > 0 && (
              <>
                <div className="cart-total">Total: ₹{getCartTotal().toFixed(2)}</div>
                <div className="cart-actions">
                  <button className="cart-clear" onClick={clearCart}>Clear</button>
                  <Link to="/cart" className="cart-checkout btn">Checkout</Link>
                </div>
              </>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
