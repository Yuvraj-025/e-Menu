import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import api from '../utils/api';
import '../styles/cart.css';

const CartPage = () => {
  const { cartItems, getCartTotal, addToCart, decreaseQty, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(null);
  const [error, setError] = useState(null);
  const [tip, setTip] = useState(0);
  const { settings } = useSettings();

  const subTotal = getCartTotal();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/order', { items: cartItems, tip: Number(tip) || 0 });
      setOrderProcessed(data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (orderProcessed) {
    return (
      <div className="cart-page">
        <div className="cart-container" style={{ display: 'block', maxWidth: '600px', background: '#fff', padding: '2rem', borderRadius: '12px' }}>
          <div className="bill-success">
            <h3><i className="fas fa-check-circle"></i> Order Placed!</h3>
            <p>Your order #{orderProcessed.orderId} has been successfully placed.</p>
            
            <div className="receipt-box">
              <div className="receipt-header">
                <div className="receipt-company">
                  <h3>{settings?.cafeName || 'Coffee Shop'}</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{settings?.address || '1912 Harvest Lane\nNew York, NY 12210'}</p>
                </div>
                <div className="receipt-title">
                  <h2>ONLINE RECEIPT</h2>
                </div>
              </div>

              <div className="receipt-meta">
                <div className="meta-col">
                  <strong>BILL TO</strong>
                  <p>Guest Customer<br/>Dine-in / Takeaway</p>
                </div>
                <div className="meta-col right-align">
                  <div className="meta-row"><span>RECEIPT #</span> <span>{orderProcessed.orderId.replace('ORD-', 'US-')}</span></div>
                  <div className="meta-row"><span>RECEIPT DATE</span> <span>{new Date(orderProcessed.date).toLocaleDateString('en-GB')}</span></div>
                </div>
              </div>

              <div className="receipt-total-banner">
                <h2>Receipt Total</h2>
                <h2>₹{orderProcessed.total.toFixed(2)}</h2>
              </div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="right-align">UNIT PRICE</th>
                    <th className="right-align">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {orderProcessed.items.map(item => (
                    <tr key={item._id}>
                      <td>{item.quantity}</td>
                      <td>{item.name}</td>
                      <td className="right-align">{item.price.toFixed(2)}</td>
                      <td className="right-align">{item.itemTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="receipt-footer">
                <div className="footer-left">
                  <strong>PAYMENT INSTRUCTION</strong>
                  <p>Pay at the counter<br/>{settings?.email || 'contact@coffeeshop.com'}</p>
                  <br/>
                  <strong>TERMS & CONDITIONS</strong>
                  <p>Payment is due immediately.</p>
                </div>
                <div className="footer-right">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{orderProcessed.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tip Amount</span>
                    <span>{orderProcessed.tip.toFixed(2)}</span>
                  </div>
                  <div className="qr-code">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${orderProcessed.orderId}`} alt="QR Code" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="no-print receipt-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.print()} 
                className="btn btn-primary" 
                style={{ background: '#34495e', color: 'white' }}
              >
                <i className="fas fa-print"></i> Print Receipt
              </button>
              <Link to="/menu" className="btn btn-primary">Return to Menu</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart-msg">
          <p>Your cart is currently empty.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item-row">
                <img src={getImageUrl(item.image)} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                </div>
                <div className="qty-controls" style={{ background: '#f4f4f4', padding: '4px', borderRadius: '999px' }}>
                  <button className="decrease" onClick={() => decreaseQty(item._id)}>-</button>
                  <span className="qty">{item.quantity}</span>
                  <button className="increase" onClick={() => addToCart(item)}>+</button>
                </div>
                <button 
                  className="remove-item" 
                  onClick={() => removeFromCart(item._id)}
                  style={{ marginLeft: '15px', fontSize: '1.5rem' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{ alignItems: 'center' }}>
              <span>Tip Amount (₹)</span>
              <input 
                type="number" 
                min="0"
                value={tip} 
                onChange={(e) => setTip(e.target.value)}
                style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{(subTotal + Number(tip || 0)).toFixed(2)}</span>
            </div>
            
            {error && <div style={{ color: '#e74c3c', marginTop: '15px', textAlign: 'center' }}>{error}</div>}
            
            <button 
              className="btn btn-primary btn-block" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Generate Bill & Checkout'}
            </button>
            <button 
              className="btn btn-block" 
              onClick={clearCart}
              style={{ background: '#e74c3c', marginTop: '10px' }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
