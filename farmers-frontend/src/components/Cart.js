import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ Category icon function
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

    return (
        <div className="cart-container">
            <h2 className="cart-title">🛒 Your Shopping Cart</h2>

            {cart.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty. Start shopping!</p>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-info">
                                    {/* ✅ Added category icon beside product name */}
                                    <h4 className="item-name">{getCategoryIcon(item.category)} {item.name}</h4>
                                    <p className="item-desc">Qty: {item.quantity}</p>
                                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button className="remove-btn-styled" onClick={() => removeItem(item.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Total: <span>${total.toFixed(2)}</span></h3>
                        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
