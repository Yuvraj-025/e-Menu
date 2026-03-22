import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item._id !== action.payload);
    case 'DECREASE_QTY':
      return state.map(item =>
        item._id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(
    cartReducer,
    [],
    (initial) => {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : initial;
    }
  );

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const decreaseQty = (id) => dispatch({ type: 'DECREASE_QTY', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getCartCount = () => cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const getCartTotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Also provide a way to lookup specific item quantity for Menu grid
  const getItemQty = (id) => {
    const item = cartItems.find(item => item._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      decreaseQty, 
      clearCart,
      getCartCount,
      getCartTotal,
      getItemQty
    }}>
      {children}
    </CartContext.Provider>
  );
};
