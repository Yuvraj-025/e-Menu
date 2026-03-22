import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import '../styles/menu.css';

const MenuCard = ({ item }) => {
  const { addToCart, decreaseQty, removeFromCart, getItemQty } = useCart();
  const quantity = getItemQty(item._id);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Helper to resolve image paths whether they are full URLs or local relative paths
  const getImageUrl = (path) => {
    if (path.startsWith('http')) return path;
    // Ensure path starts with / for serving from public correctly
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div ref={cardRef} className={`menu-card animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
      <img src={getImageUrl(item.image)} alt={item.name} className="menu-card-img" />
      <div className="menu-card-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-card-footer">
          <span className="price">₹{item.price.toFixed(2)}</span>
          
          <div className="cart-controls">
            {quantity === 0 ? (
              <button 
                className="add-to-cart-btn" 
                onClick={() => addToCart(item)}
                aria-label={`Add ${item.name} to cart`}
              >
                +
              </button>
            ) : (
              <div className="qty-controls">
                <button 
                  className="decrease" 
                  onClick={() => {
                    if (quantity === 1) {
                      removeFromCart(item._id);
                    } else {
                      decreaseQty(item._id);
                    }
                  }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty">{quantity}</span>
                <button 
                  className="increase" 
                  onClick={() => addToCart(item)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Coffee', 'Breakfast', 'Restaurant'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get('/menu');
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading menu:", err);
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.category === activeFilter);

  return (
    <div className="menu-page">
      <section className="menu-section">
        <h2>Our Menu</h2>

        <div className="menu-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Brewing your menu...</div>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="no-results">No items found in this category.</div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MenuPage;
