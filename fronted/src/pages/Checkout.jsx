import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStripeContext } from "../utils/StripeContext";
import "../styles/Checkout.css";

const Checkout = ({ cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent } = useStripeContext();

  // Aceptamos cart como:
  // 1) un array de items: [ { id, nombre, precio | price, cantidad | quantity } ]
  // 2) un objeto con .items: { items: [...] }
  const productos = Array.isArray(cart)
    ? cart
    : Array.isArray(cart?.items)
    ? cart.items
    : [];

  const normalizedProductos = productos.map((it) => ({
    id: it.id,
    nombre: it.nombre ?? it.name ?? "Sin nombre",
    precio: Number(it.precio ?? it.price ?? 0) || 0,
    cantidad: Number(it.cantidad ?? it.quantity ?? 1) || 1,
    imagen: it.imagen_url ?? it.image ?? it.imageUrl ?? null,
    type: it.type ?? "producto",
  }));

  const [clientSecret, setClientSecret] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calcular total seguro (evita NaN)
  useEffect(() => {
    const t = normalizedProductos.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(t);
  }, [cart]); // disparar cuando cambie el prop cart

  // Crear PaymentIntent solo si total > 0 y no hay clientSecret
  useEffect(() => {
    if (total > 0 && !clientSecret) {
      crearIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const crearIntent = async () => {
    try {
      setLoading(true);

      // Metadata: enviamos los productos como string para que el backend lo guarde si hace falta
      const metadata = {
        productos: JSON.stringify(
          normalizedProductos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.cantidad,
            precio: p.precio,
          }))
        ),
      };

      // createPaymentIntent espera el monto en la unidad "normal" (ej: pesos) y el contexto lo convertirá.
      const secret = await createPaymentIntent(
  total,
  {
    productos: JSON.stringify(
      normalizedProductos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio
      }))
    )
  }
);

      if (!secret) throw new Error("No se recibió clientSecret desde el servidor.");
      setClientSecret(secret);
    } catch (err) {
      console.error("Error creando intent:", err);
      alert(err.message || "Error creando la sesión de pago.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe) {
      alert("Stripe no está listo todavía.");
      return;
    }
    if (!elements) {
      alert("Error al cargar el formulario de pago.");
      return;
    }
    if (!clientSecret) {
      alert("Esperando sesión de pago (clientSecret). Intenta de nuevo en unos segundos.");
      return;
    }

    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("No se encontró el CardElement.");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.error("Stripe error:", result.error);
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        alert("Pago completado con éxito");
        // aquí podrías limpiar carrito (desde contexto) o redirigir
      } else {
        console.log("PaymentIntent:", result.paymentIntent);
        alert("Pago procesado, estado: " + (result.paymentIntent?.status || "desconocido"));
      }
    } catch (err) {
      console.error("Error confirmando pago:", err);
      alert(err.message || "Error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Finalizar Compra</h2>

      <div className="checkout-box">
        {/* RESUMEN */}
        <div className="checkout-summary">
          <h3>Resumen</h3>

          {normalizedProductos.length === 0 && <p>Tu carrito está vacío.</p>}

          {normalizedProductos.map((item) => (
            <div key={`${item.type}-${item.id}`} className="summary-item">
              <span>{item.nombre} x{item.cantidad}</span>
              <span>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.precio * item.cantidad)}</span>
            </div>
          ))}

          <div className="total-box">
            <strong>Total:</strong>
            <strong>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total)}</strong>
          </div>
        </div>

        {/* FORMULARIO PAGO */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Datos de Pago</h3>

          <label>Tarjeta</label>
          <div className="card-element-box" style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#333",
                    "::placeholder": { color: "#888" }
                  },
                  invalid: { color: "red" }
                }
              }}
            />
          </div>

          <button type="submit" className="checkout-btn" disabled={!stripe || loading}>
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </form>
      </div>

      <div className="test-data">
        <h3>Tarjetas de prueba</h3>
        <p><b>Visa Aprobada:</b> 4242 4242 4242 4242</p>
        <p><b>Vencimiento:</b> 12 / 30</p>
        <p><b>CVC:</b> 123</p>
      </div>
    </div>
  );
};

export default Checkout;
