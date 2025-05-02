// components/Checkout.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const paypalRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalAmount = cart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2);

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: totalAmount,
                        },
                    }],
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    const payerName = details.payer.name.given_name;
                    const summary = {
                        transactionId: details.id,
                        name: payerName,
                        amount: totalAmount,
                        cart,
                        date: new Date().toISOString(),
                    };

                    localStorage.setItem('orderSummary', JSON.stringify(summary));
                    localStorage.removeItem('cart');
                    navigate('/order-summary');
                });
            },
        }).render(paypalRef.current);
    }, [navigate]);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalAmount = cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Checkout</h2>
                <p style={styles.subtitle}>You're about to complete your order.</p>

                <div style={styles.cartDetails}>
                    <h3>Order Summary:</h3>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <ul style={styles.cartList}>
                            {cart.map((item, index) => (
                                <li key={index} style={styles.cartItem}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div style={styles.total}>
                        <strong>Total:</strong>
                        <strong>${totalAmount}</strong>
                    </div>
                </div>

                <div ref={paypalRef} style={styles.paypal} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        color: '#343a40',
    },
    subtitle: {
        marginBottom: '1.5rem',
        color: '#6c757d',
    },
    cartDetails: {
        textAlign: 'left',
        marginBottom: '2rem',
    },
    cartList: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '1rem',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9ecef',
        padding: '0.5rem 0',
        fontSize: '1rem',
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        marginTop: '1rem',
        color: '#212529',
    },
    paypal: {
        marginTop: '2rem',
    },
};

export default Checkout;
