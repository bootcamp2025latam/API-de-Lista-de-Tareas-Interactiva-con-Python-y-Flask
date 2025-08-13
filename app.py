import os
import logging
from flask import Flask, request
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Enable CORS for all routes
CORS(app)

# Add request logging middleware
@app.before_request
def log_request_info():
    app.logger.debug('Request: %s %s', request.method, request.url)
    if request.is_json and request.json:
        app.logger.debug('Request JSON: %s', request.json)

@app.after_request
def log_response_info(response):
    app.logger.debug('Response: %s', response.status)
    return response

# Import routes after app creation to avoid circular imports
from routes import *
