from flask import Blueprint, request, jsonify
from flask_login import UserMixin, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, login_manager

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Product



auth = Blueprint('auth', __name__)

# Define User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register Route
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password and create user
    hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, email=email, password=hashed_pw, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'user_id': new_user.id, 'username': new_user.username, 'role': new_user.role}), 201

# Login Route
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    login_user(user)
    return jsonify({'message': 'Login successful', 'user_id': user.id, 'role': user.role, 'username': user.username}), 200

# Logout Route
@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@auth.route('/products', methods=['POST'])
def create_product():
    data = request.json
    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        quantity=data['quantity'],
        category=data['category'],
        farmer_id=data['farmer_id']  # Hardcoded for now, or you can get this some other way
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'message': 'Product created successfully'}), 201


@auth.route('/products', methods=['GET'])
def get_my_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'quantity': p.quantity,
        'category': p.category
    } for p in products])

@auth.route('/products/user/<int:user_id>', methods=['GET'])
def get_products_by_user(user_id):
    products = Product.query.filter_by(farmer_id=user_id).all()
    result = [{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'quantity': p.quantity,
        'category': p.category
    } for p in products]
    return jsonify(result)


@auth.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)

    data = request.json
    product.name = data['name']
    product.description = data.get('description', '')
    product.price = data['price']
    product.quantity = data['quantity']
    product.category = data['category']
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})


@auth.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})