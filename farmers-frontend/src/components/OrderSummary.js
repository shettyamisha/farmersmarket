import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSummary = () => {
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('orderSummary');
        if (stored) {
            setSummary(JSON.parse(stored));
        }
    }, []);

    if (!summary) return <p style={styles.loading}>Loading order summary...</p>;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4); // Avg of 3–5 days

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'vegetables': return '🥦';
            case 'fruits': return '🍎';
            case 'dairy': return '🥛';
            case 'baked goods': return '🍞';
            case 'meat': return '🥩';
            case 'beverages': return '🍹';
            default: return '🛒';
        }
    };

    const handleDownloadReceipt = () => {
        const receiptContent = `
RECEIPT
--------------------------------
Name: ${summary.name}
Transaction ID: ${summary.transactionId}
Date: ${new Date(summary.date).toLocaleString()}
Amount: $${summary.amount}

Items:
${summary.cart.map(item => `- ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Estimated Delivery: ${estimatedDelivery.toDateString()}
Tracking ID: TRK-${summary.transactionId.slice(0, 8).toUpperCase()}
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'receipt.txt';
        link.click();
    };

    const handleOrderTracking = () => {
        navigate(`/order-tracking/${summary.transactionId}`);
    };

    const handleNotifyCustomer = () => {
        const subject = encodeURIComponent('Order Confirmation');
        const body = encodeURIComponent(
            `Hi ${summary.name},\n\nThank you for your order!\n\n` +
            `Transaction ID: ${summary.transactionId}\n` +
            `Estimated Delivery: ${estimatedDelivery.toDateString()}\n` +
            `Tracking ID: TRK-${summary.transactionId.slice(0, 8).toUpperCase()}\n\n` +
            `We’ll notify you with any further updates.\n\nBest regards,\nThe Farmers Market Team`
        );

        const email = summary.email || ''; // Make sure this field exists in summary
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`, '_blank');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>✅ Payment Completed</h2>
                <p style={styles.subtitle}>Your order is confirmed!</p>

                <p><strong>Thank you, {summary.name}.</strong></p>
                <p>Transaction ID: <code>{summary.transactionId}</code></p>
                <p>Total Paid: <strong>${summary.amount}</strong></p>
                <p>Date: {new Date(summary.date).toLocaleString()}</p>

                <p style={styles.delivery}>
                    📦 Estimated Delivery: <strong>{estimatedDelivery.toDateString()}</strong><br />
                    🚚 Tracking ID: <code>TRK-{summary.transactionId.slice(0, 8).toUpperCase()}</code>
                </p>

                <h3 style={styles.sectionTitle}>Order Summary</h3>
                <ul style={styles.itemList}>
                    {summary.cart.map((item, index) => (
                        <li key={index} style={styles.item}>
                            <div style={styles.itemDetails}>
                                {/* Add Category Icon beside product name */}
                                <div style={styles.itemName}>
                                    {getCategoryIcon(item.category)} {item.name} × {item.quantity}
                                </div>
                                <div style={styles.itemPrice}>
                                    ${item.price.toFixed(2)} each
                                </div>
                            </div>
                            <div style={styles.itemTotal}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>

                <div style={styles.buttonRow}>
                    <button onClick={handleDownloadReceipt} style={styles.buttonOutline}>
                        🧾 Download Receipt
                    </button>
                    <button onClick={() => window.location.href = '/'} style={styles.button}>
                        Continue Shopping
                    </button>
                    <button onClick={handleOrderTracking} style={styles.button}>
                        📦 Order Tracking
                    </button>
                    <button onClick={handleNotifyCustomer} style={styles.buttonOutline}>
                        ✉️ Click to Notify
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    loading: {
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '1.2rem',
        color: '#6c757d',
    },
    container: {
        backgroundColor: '#f8f9fa',
        backgroundImage: `url('https://th.bing.com/th/id/OIP.VBVgazMOtJ17aVjYgoE4OgHaEo?w=296&h=184&c=7&r=0&o=5&dpr=1.3&pid=1.7')`,
        backgroundSize: 'cover', // Ensures the image covers the full screen
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating if it's smaller than the viewport
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white background
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        maxWidth: '700px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        color: '#28a745',
    },
    subtitle: {
        fontSize: '1.2rem',
        marginBottom: '1.5rem',
        color: '#343a40',
    },
    delivery: {
        marginTop: '1.5rem',
        fontSize: '1rem',
        color: '#495057',
    },
    sectionTitle: {
        marginTop: '2rem',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#495057',
        borderBottom: '1px solid #dee2e6',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
    },
    itemList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        borderBottom: '1px solid #e9ecef',
    },
    itemDetails: {
        flex: 1,
        textAlign: 'left',
    },
    itemName: {
        fontWeight: 500,
        fontSize: '1rem',
        color: '#212529',
    },
    itemPrice: {
        fontSize: '0.9rem',
        color: '#6c757d',
    },
    itemTotal: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '#212529',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2rem',
        flexWrap: 'wrap',
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    buttonOutline: {
        padding: '12px 24px',
        backgroundColor: '#ffffff',
        color: '#28a745',
        border: '2px solid #28a745',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default OrderSummary;
