import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('vedalush_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const skipNextSyncRef = useRef(false);

  // Sync with localStorage as fallback/local cache
  useEffect(() => {
    localStorage.setItem('vedalush_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch Cart from Backend on Login
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
        });
        
        const dbItems = response.data.items || [];
        
        // If local cart has items and user just logged in (or we just want to override)
        // To avoid multiplication on refresh, we simply use the DB cart as the single source of truth for now.
        // The front-end multiplication bug occurs because local storage was continuously merged with DB on every load.
        skipNextSyncRef.current = true; // Prevent the debounce from firing immediately after load
        setCartItems(dbItems);
      } catch (error) {
        console.error('Failed to fetch cart from DB:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchCart();
  }, [user]);

  // Debounced Sync to Backend
  useEffect(() => {
    if (!user || isInitialLoad) return;
    
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    const syncToDB = async () => {
      try {
        const payload = cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }));
        
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/sync`, {
          items: payload
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
        });
      } catch (error) {
        console.error('Failed to sync cart to DB:', error);
      }
    };

    const timer = setTimeout(() => {
      syncToDB();
    }, 1000); // 1-second debounce to prevent server overload

    return () => clearTimeout(timer);
  }, [cartItems, user, isInitialLoad]);

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    openCart();
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
