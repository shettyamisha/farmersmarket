from app import create_app, db
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")

app = create_app()

# Enable CORS
CORS(app)

# Create the DB tables on startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
