"""
Darwaza Configuration - Central settings and constants
"""
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'darwaza-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7

# API Keys
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# CORS
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

# Subscription Plans - Fixed prices (KWD)
SUBSCRIPTION_PLANS = {
    "free": {"price_monthly": 0.0, "price_yearly": 0.0},
    "family": {"price_monthly": 10.0, "price_yearly": 99.0},
    "heritage": {"price_monthly": 25.0, "price_yearly": 250.0},
    "premium": {"price_monthly": 55.0, "price_yearly": 550.0}
}
