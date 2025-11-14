import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error parsing cart data from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id && i.type === item.type);
            if (existingItem) {
                // Si ya existe, actualiza la cantidad
                return prevItems.map(i =>
                    i.id === item.id && i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                // Si no existe, lo añade con cantidad 1
                return [...prevItems, { ...item, quantity: 1, type: 'servicio' }];
            }
        });
    };

    const removeFromCart = (id, type) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.type === type)));
    };

    const updateQuantity = (id, type, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id, type);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id && item.type === type ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

