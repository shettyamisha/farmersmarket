from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager

jwt = JWTManager()

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = '1234@hii'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

    # 🛡 JWT CONFIG
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # change this in production!
    app.config['JWT_TOKEN_LOCATION'] = ['headers']  # Where to look for tokens
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    login_manager.init_app(app)
    db.init_app(app)
    jwt.init_app(app)  # ✅ Initialize JWT here

    from .routes import auth
    app.register_blueprint(auth)

    return app