// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-hero">
            <div className="home-overlay">
                <div className="home-text">
                    <p className="home-intro">Welcome to</p>
                    <h1 className="home-title">Farmer's Market </h1>
                    <p className="home-subtitle">
                        Farm-fresh groceries. Just a click away
                    </p>
                    <div className="home-buttons">
                        <Link to="/login" className="home-btn filled">Login</Link>
                        <Link to="/register" className="home-btn outline">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
