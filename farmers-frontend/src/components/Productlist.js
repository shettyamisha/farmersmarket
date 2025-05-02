import { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [category, setCategory] = useState('');

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

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/products');
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart');
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterProducts(term, sortOrder, category);
    };

    const handleSort = (e) => {
        const order = e.target.value;
        setSortOrder(order);
        filterProducts(searchTerm, order, category);
    };

    const handleCategory = (e) => {
        const cat = e.target.value;
        setCategory(cat);
        filterProducts(searchTerm, sortOrder, cat);
    };

    const filterProducts = (term, order, cat) => {
        let result = [...products].filter(p =>
            (p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)) &&
            (cat ? p.category === cat : true)
        );

        if (order === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (order === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="product-page">
            <h2 className="page-title">Shop Products</h2>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-bar"
                />

                <select onChange={handleSort} className="sort-select" value={sortOrder}>
                    <option value="">Sort by Price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>

                <select onChange={handleCategory} className="sort-select" value={category}>
                    <option value="">Filter by Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="product-grid">
                {filteredProducts.map(p => (
                    <div key={p.id} className="product-card">
                        {/* ✅ Updated name with icon */}
                        <h3>{getCategoryIcon(p.category)} {p.name}</h3>
                        <p className="description">{p.description}</p>
                        <p className="price">${p.price.toFixed(2)}</p>
                        {user?.role === 'customer' && (
                            <button onClick={() => addToCart(p)} className="add-to-cart">
                                Add to Cart
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
