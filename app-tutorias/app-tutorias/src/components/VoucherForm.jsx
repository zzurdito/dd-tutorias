import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';

const stripePromise = loadStripe("pk_test_51QAq8XF4F5VOfFUrbGFMltFiVZVoOfxkbegDQbs7gXpoIRFNRPzyVL2bFzXyfnagtd6NoDXaRWakmwIt07X7Zdir00F6YJj0T5");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (!error) {
            try {
                const { id } = paymentMethod;
                
                const { data } = await axios.post('http://localhost:3001/api/checkout', {
                    id,
                    amount: 1000, // en centavos
                });

                setMessage(data.message); // Mensaje de éxito del backend
            } catch (error) {
                console.error(error);
                setMessage("Payment failed. Please try again.");
            }
        } else {
            console.error(error);
            setMessage("Payment method creation failed. Please check your details.");
        }
        elements.getElement(CardElement).clear();
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="m-8 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Comprar Tokens</h2>
            
            {/* Descripción del Producto */}
            <p className="text-gray-600 text-center">
                Get 1 token to meet your tutor whenever you want in the app.
            </p>

            {/* Resumen del Pedido */}
            <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Checkout</h3>
                <p className="text-gray-700">Tokens: <span className="font-semibold">1</span></p>
                <p className="text-gray-700">Total price: <span className="font-semibold">10 €</span></p>
            </div>

            {/* Etiqueta de Precio */}
            <div className="text-center bg-blue-100 text-blue-800 font-semibold py-2 rounded-md">
                Precio: 10 €
            </div>

            {/* Información de Contacto */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                />
            </div>

            {/* Sección de Pago */}
            <div className="border border-gray-300 p-3 rounded-lg">
                <CardElement
                    className="w-full p-2 text-gray-700 placeholder-gray-400"
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#32325d',
                                '::placeholder': {
                                    color: '#a0aec0',
                                },
                            },
                            invalid: {
                                color: '#e53e3e',
                            },
                        },
                    }}
                />
            </div>

            {/* Botón de Compra */}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : "Buy Tokens"}
            </button>

            {/* Mensaje de estado */}
            {message && <p className="text-center mt-4 text-red-500">{message}</p>}
        </form>
    );
};

function VoucherForm() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}

export default VoucherForm;

