import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OrderTracking = () => {
    const { transactionId } = useParams();
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrderStatus({
                status: 'Shipped',
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
                trackingNumber: `TRK-${transactionId.slice(0, 8).toUpperCase()}`,
            });
        }, 1000);
    }, [transactionId]);

    if (!orderStatus) return <div style={styles.loading}>Loading your order tracking...</div>;

    const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(orderStatus.status);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>📦 Order Tracking</h2>
                <p style={styles.subtitle}>Tracking your purchase every step of the way.</p>

                <div style={styles.infoGroup}>
                    <p><strong>Transaction ID:</strong> <code>{transactionId}</code></p>
                    <p><strong>Tracking Number:</strong> <code>{orderStatus.trackingNumber}</code></p>
                    <p><strong>Status:</strong> {orderStatus.status}</p>
                    <p><strong>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}</p>
                </div>

                <div style={styles.progressWrapper}>
                    {steps.map((step, index) => (
                        <div key={index} style={styles.stepWrapper}>
                            <div
                                style={{
                                    ...styles.circle,
                                    backgroundColor: index <= currentStepIndex ? '#007bff' : '#dee2e6',
                                }}
                            >
                                {index + 1}
                            </div>
                            <p
                                style={{
                                    ...styles.stepLabel,
                                    color: index <= currentStepIndex ? '#007bff' : '#6c757d',
                                }}
                            >
                                {step}
                            </p>
                            {index < steps.length - 1 && (
                                <div
                                    style={{
                                        ...styles.line,
                                        backgroundColor: index < currentStepIndex ? '#007bff' : '#dee2e6',
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button onClick={() => window.location.href = '/'} style={styles.button}>🏠 Back to Home</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f1f3f5',
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/back_our/20190620/ourmid/pngtree-cartoon-takeaway-order-poster-background-template-image_152758.jpg')`, // Add your background image URL here
        backgroundSize: 'cover', // Ensures the image covers the screen
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '0.3rem',
        color: '#007bff',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#6c757d',
        marginBottom: '2rem',
    },
    infoGroup: {
        textAlign: 'left',
        marginBottom: '2rem',
        fontSize: '1.1rem',
        lineHeight: '1.6',
    },
    progressWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        marginBottom: '2rem',
        padding: '0 1rem',
    },
    stepWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        flex: 1,
    },
    circle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    stepLabel: {
        fontSize: '0.85rem',
        textAlign: 'center',
        maxWidth: '80px',
    },
    line: {
        position: 'absolute',
        top: '18px',
        left: '50%',
        width: '100%',
        height: '4px',
        zIndex: -1,
        transform: 'translateX(50%)',
    },
    button: {
        padding: '14px 28px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1.5rem',
    },
    loading: {
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '4rem',
        color: '#6c757d',
    },
};


export default OrderTracking;
