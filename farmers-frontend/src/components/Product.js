import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Product.css';

const Product = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user_id;

    const initialFormState = {
        farmer_id: userId,
        name: '',
        description: '',
        price: '',
        quantity: '',
        quantity_type: 'unit',
        category: '',
        image: ''
    };

    const [form, setForm] = useState(initialFormState);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await axios.put(`http://127.0.0.1:5000/products/${form.id}`, form);
            } else {
                await axios.post('http://127.0.0.1:5000/products', form);
            }
            setForm(initialFormState);
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err.response?.data || err.message);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://127.0.0.1:5000/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
            }
        }
    };

    const fetchProducts = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://127.0.0.1:5000/products/user/${userId}`);
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'vegetables': return '🥦';
            case 'fruits': return '🍎';
            case 'dairy': return '🥛';
            case 'baked goods': return '🍞';
            case 'meat': return '🥩';
            case 'beverages': return '🍹';
            default: return '🛒';
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter ? p.category.toLowerCase() === filter.toLowerCase() : true)
    );

    return (
        <div className="product-page">
            <form onSubmit={handleSubmit} className="product-form">
                <h2>{form.id ? 'Edit Product' : 'Add New Product'}</h2>

                <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />

                <div className="quantity-input-group">
                    <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
                    <select name="quantity_type" value={form.quantity_type} onChange={handleChange}>
                        <option value="unit">Unit(s)</option>
                        <option value="kg">Kilogram(s)</option>
                        <option value="g">Gram(s)</option>
                        <option value="liters">Liter(s)</option>
                        <option value="ml">Milliliter(s)</option>
                    </select>
                </div>

                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="baked goods">Baked Goods</option>
                    <option value="meat">Meat</option>
                    <option value="beverages">Beverages</option>
                </select>


                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        {form.id ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                        Go to Home
                    </button>
                </div>
            </form>

            <div className="filter-bar">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="baked goods">Baked Goods</option>
                    <option value="meat">Meat</option>
                    <option value="beverages">Beverages</option>
                </select>
            </div>

            <div className="product-list">
                {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                    <div className="product-card" key={p.id}>
                        <div className="product-info">
                            <h3>{getCategoryIcon(p.category)} {p.name}</h3>
                            <p>{p.description || 'No description'}</p>
                            <p><strong>${p.price}</strong> | Qty: {p.quantity} {p.quantity_type}</p>
                            <p className="category-label">{p.category}</p>
                            <div className="product-actions">
                                <button onClick={() => handleEdit(p)} className="btn btn-edit">✏️ Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="btn btn-delete">🗑️ Delete</button>
                            </div>
                        </div>
                    </div>
                )) : <p>No products found.</p>}
            </div>
        </div>
    );
};

export default Product;
