const express = require('express');
const PaymentsController = require('../controllers/PaymentsController');
const viewAuth = require('../middlewares/viewAuth');

const router = express.Router();

router.post('/create-payment-intent', viewAuth(['cliente', 'admin', 'empleado']), PaymentsController.createPaymentIntent);
router.post('/webhook', express.raw({type: 'application/json'}), PaymentsController.handleWebhook);

// Rutas para reembolsos
router.post('/refund', viewAuth(['admin', 'empleado']), PaymentsController.processRefund);
router.get('/refunds/orden/:orden_id', viewAuth(['cliente', 'admin', 'empleado']), PaymentsController.getRefundsByOrden);
router.get('/refunds/cliente/:cliente_id', viewAuth(['cliente', 'admin', 'empleado']), PaymentsController.getRefundsByCliente);
router.get('/refunds', viewAuth(['admin']), PaymentsController.getAllRefunds);

module.exports = router;