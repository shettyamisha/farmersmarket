// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'farmer',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/register', formData);
            alert('Registered successfully!');
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error(error);
            alert('Registration failed.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
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
                    <select name="role" onChange={handleChange} value={formData.role}>
                        <option value="farmer">Farmer</option>
                        <option value="customer">Customer</option>

                    </select>
                    <button type="submit">Register</button>
                </form>
                <p className="login-text">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
