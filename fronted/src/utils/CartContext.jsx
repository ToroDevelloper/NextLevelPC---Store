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
        const { id, type = 'producto', quantity = 1, precio, price } = item;
        
        // Calcular el precio del nuevo item
        const itemPrice = Number(precio ?? price ?? 0);
        const newItemTotal = itemPrice * quantity;
        
        // Calcular el total actual del carrito
        const currentCartTotal = cartItems.reduce((total, cartItem) => {
            const cartItemPrice = Number(cartItem.precio ?? cartItem.price ?? 0);
            return total + (cartItemPrice * cartItem.quantity);
        }, 0);
        
        // Validar que el total del carrito (incluyendo el nuevo item) sea mínimo $2,000 COP
        const newTotal = currentCartTotal + newItemTotal;
        if (newTotal < 2000) {
            throw new Error('El valor total del carrito debe ser mínimo $2,000 COP');
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === id && i.type === type);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === id && i.type === type
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                return [...prevItems, { ...item, type, quantity }];
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
    console.log('CartContext re-render - items:', cartItems.length);

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