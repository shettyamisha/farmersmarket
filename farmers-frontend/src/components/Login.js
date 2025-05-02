// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:5000/login', formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            const user = JSON.parse(localStorage.getItem('user'));
            alert('Login successful!');

            const role = user.role;
            if (role === 'farmer') {
                navigate('/product');
            } else if (role === 'customer') {
                navigate('/products');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p className="register-text">
                    Don’t have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
