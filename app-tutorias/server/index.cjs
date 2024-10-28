const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = new Stripe("sk_test_51QAq8XF4F5VOfFUrUXlwHX3DlkK8EkrYFnYkJXD9CawG0FJLltSfOwnZCPIJKI5GTPqhTPSq366wvGV3FeMy5PsY00xZYlbRfG");

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/checkout', async (req, res) => {
    try {
        const { id, amount } = req.body;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: 'EUR',
            description: 'Tokens tutorias Universae',
            payment_method: id,
            confirm: true, // Confirma el pago al crear el PaymentIntent
            return_url: 'http://localhost:5173/content/calendar',
        });

        res.json({ message: 'Payment successful!', success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Payment failed', error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Server running on port', 3001);
});
