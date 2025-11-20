const express = require('express');
const Stripe = require('stripe');
const db = require('../config/db');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Necesario para recibir RAW BODY
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("⚠ Error verificando webhook:", err.message);
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        // 👉 Cuando el pago es exitoso
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            try {
                // Marcar orden como pagada
                await db.query(
                    `UPDATE ordenes 
                     SET estado_pago = 'pagado', estado_orden = 'completada'
                     WHERE numero_orden = ?`,
                    [orderId]
                );

                // Insertar registro de pago
                await db.query(
                    `INSERT INTO pagos
                    (orden_id, stripe_payment_intent, monto, moneda, estado)
                    VALUES (
                        (SELECT id FROM ordenes WHERE numero_orden = ?),
                        ?, ?, ?, 'pagado'
                    )`,
                    [
                        orderId,
                        paymentIntent.id,
                        paymentIntent.amount / 100,
                        paymentIntent.currency.toUpperCase(),
                    ]
                );

                console.log("💰 Pago registrado en la BD con éxito.");
            } catch (err) {
                console.error("❌ Error guardando pago:", err);
            }
        }

        res.json({ received: true });
    }
);

module.exports = router;
