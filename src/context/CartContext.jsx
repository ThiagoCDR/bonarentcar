import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (item) => {
        // Check if item is already in cart to avoid duplicates, or allow quantity logic
        // For simplicity, we'll assume one of each car/type combination allowed or just append
        setCartItems([...cartItems, item]);
        setIsCartOpen(true); // Open cart when item added
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.cartId !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isCartOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
