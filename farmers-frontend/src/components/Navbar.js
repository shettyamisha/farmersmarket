import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [cartCount, setCartCount] = useState(0);
    const [isProfileVisible, setIsProfileVisible] = useState(false);

    // ✅ Function to update cart count
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    };

    // ✅ Update on mount
    useEffect(() => {
        updateCartCount();

        // ✅ Also update every second to catch changes
        const interval = setInterval(updateCartCount, 1000);
        return () => clearInterval(interval);
    }, []);

    // ✅ Logout functionality
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ✅ Optional: skip rendering for non-customers
    if (!user || user.role !== 'customer') return null;

    return (
        <div className="navbar">
            <h2 className="logo" onClick={() => navigate('/')}>🌽 Farmer's Market</h2>
            <div className="navbar-right">
                {/* Cart button */}
                <div className="nav-cart" onClick={() => navigate('/cart')}>
                    🛒 <span className="cart-count">{cartCount}</span>
                </div>

                {/* User Profile */}
                <div className="user-profile">
                    <button onClick={() => setIsProfileVisible(!isProfileVisible)} className="user-btn">
                        {/* Display a user icon or the user's name */}
                        {user ? (
                            <span>{user.name ? `Hello, ${user.name}` : '👤'}</span>
                        ) : (
                            '👤'  // Default user icon when user is not logged in
                        )}
                    </button>
                    {isProfileVisible && (
                        <div className="profile-dropdown">
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
