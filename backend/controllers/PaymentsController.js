// controllers/PaymentsController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentsController {
  static async createPaymentIntent(req, res) {
    try {
      // logging para depuración
      console.log('--- createPaymentIntent - request body ---');
      console.log(JSON.stringify(req.body).slice(0, 2000)); // limita tamaño en logs
      console.log('--- createPaymentIntent - req.usuario ---');
      console.log(req.usuario);

      // Extraer amount: soportamos amount (moneda normal) o amount_cents (enteros)
      // Preferimos amount_cents si llega.
      let { amount, amount_cents, currency = 'cop', metadata = {} } = req.body;

      // Validación básica
      if ((amount === undefined || amount === null) && (amount_cents === undefined || amount_cents === null)) {
        return res.status(400).json({ success: false, mensaje: 'El monto (amount o amount_cents) es requerido.' });
      }

      // Normalizar monto a centavos enteros
      let amountInCents;
      if (amount_cents !== undefined && amount_cents !== null) {
        amountInCents = Math.round(Number(amount_cents));
      } else {
        const num = Number(amount);
        if (Number.isNaN(num)) {
          return res.status(400).json({ success: false, mensaje: 'El campo amount debe ser numérico.' });
        }
        amountInCents = Math.round(num * 100);
      }

      if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
        return res.status(400).json({ success: false, mensaje: 'El monto debe ser mayor a 0.' });
      }

      if (!req.usuario) {
        return res.status(401).json({ success: false, mensaje: 'Usuario no autenticado' });
      }

      const clienteIdRaw = req.usuario.id ?? req.usuario.idusuario ?? null;
      const clienteId = clienteIdRaw ? String(clienteIdRaw) : '0';
      const clienteEmail = req.usuario.correo ?? req.usuario.email ?? 'no-email';

      // Limitar metadata para evitar rechazos por tamaño
      let safeMetadata = {};
      try {
        // Si metadata es objeto, lo convertimos a strings; si es string lo usamos.
        if (typeof metadata === 'string') {
          safeMetadata.raw = metadata.slice(0, 4500);
        } else if (typeof metadata === 'object' && metadata !== null) {
          // clonamos y convertimos values largos a strings truncados
          Object.keys(metadata).forEach(k => {
            const v = metadata[k];
            const s = typeof v === 'string' ? v : JSON.stringify(v);
            safeMetadata[k] = s.slice(0, 4500); 
          });
        }
      } catch (e) {
        safeMetadata.info = 'metadata-truncation-error';
      }

      // Añadir datos del cliente en metadata
      safeMetadata = {
        ...safeMetadata,
        cliente_id: clienteId,
        cliente_email: clienteEmail,
      };

      // Crear PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata: safeMetadata,
        automatic_payment_methods: { enabled: true },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });

    } catch (error) {
      // Logueo extendido para debugging
      console.error('Error creating payment intent:', error);
      if (error && error.raw) {
        console.error('Stripe raw error:', error.raw);
      }
      // En desarrollo puede interesarte enviar el mensaje de stripe al frontend
      const mensaje = (error && error.message) ? error.message : 'Error al crear la sesión de pago';
      return res.status(500).json({ success: false, mensaje });
    }
  }

  static async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
}

module.exports = PaymentsController;
