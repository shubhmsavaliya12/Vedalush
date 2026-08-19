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
          withCredentials: true
        });
        
        const dbItems = response.data.items || [];
        
        // Merge logic: Combine local items with DB items (Option A)
        let mergedItems = [...dbItems];
        
        // If local cart has items, merge them into the DB cart
        const localCartStr = localStorage.getItem('vedalush_cart');
        if (localCartStr) {
          const localCart = JSON.parse(localCartStr);
          if (localCart.length > 0) {
            localCart.forEach(localItem => {
              const existingIdx = mergedItems.findIndex(dbItem => dbItem.product._id === localItem.product._id);
              if (existingIdx >= 0) {
                // If it exists in both, you can either take max, sum, or ignore. Let's just keep the max for safety, or sum them.
                // Let's just override with local if the user just logged in and had local items, or just keep db items if they exist.
                // Standard merge: increase quantity by local amount.
                mergedItems[existingIdx].quantity += localItem.quantity;
              } else {
                mergedItems.push(localItem);
              }
            });
            // Need to sync the merged result back to DB immediately
            skipNextSyncRef.current = false; 
          }
        }
        
        skipNextSyncRef.current = true; // Prevent the debounce from firing immediately after load
        setCartItems(mergedItems);
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
          withCredentials: true
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
