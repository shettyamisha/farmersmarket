from app import db
from datetime import datetime

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    farmer = db.relationship('User', backref='products')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    farmer_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    status = db.Column(db.String(50), default='Processing')  # ✅ For order tracking
    tracking_number = db.Column(db.String(100))              # ✅ For optional shipment info

    # other fields like total price, date, items, etc.
