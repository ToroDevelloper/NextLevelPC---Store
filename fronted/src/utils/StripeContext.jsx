import React, { createContext, useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const StripeContext = createContext();

export const useStripeContext = () => useContext(StripeContext);

// ÚNICA instancia permitida por Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const StripeProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /** Crear PaymentIntent */
    const createPaymentIntent = async (total, metadata = {}) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("http://localhost:8080/api/payments/create-payment-intent", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Math.round(total * 100), // COP → centavos
                    currency: "cop",
                    metadata
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || "Error creando PaymentIntent");
            }

            return data.clientSecret;

        } catch (err) {
            console.error("Error Stripe:", err);
            setError(err.message);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    /** Confirmar pago */
    const pagarConStripe = async (clientSecret) => {
        const stripe = await stripePromise;

        if (!stripe) {
            throw new Error("Stripe no está disponible");
        }

        return stripe.confirmCardPayment(clientSecret);
    };

    return (
        <StripeContext.Provider
            value={{
                stripePromise, 
                createPaymentIntent,
                pagarConStripe,
                loading,
                error
            }}
        >
            {children}
        </StripeContext.Provider>
    );
};
