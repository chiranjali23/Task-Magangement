from flask import Flask, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp  
from database import init_database  # Import the init_database function
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config['SECRET_KEY'] = Config.SECRET_KEY
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES
    app.config['DEBUG'] = Config.DEBUG
    
    # Initialize extensions
    CORS(app, origins=Config.CORS_ORIGINS)
    Bcrypt(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)  # ← This should work now
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Bad request'
        }), 400
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token has expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Invalid token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Authorization token is required'
        }), 401
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'success': True,
            'message': 'TaskFlux API is running',
            'version': '1.0.0',
            'status': 'healthy'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'success': True,
            'message': 'Welcome to TaskFlux API',
            'version': '1.0.0',
            'endpoints': {
                'register': '/api/register',
                'login': '/api/login',
                'profile': '/api/profile',
                'verify_token': '/api/verify-token',
                'health': '/api/health'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    try:
        # Initialize database first
        logger.info("Initializing database...")
        init_database()
        logger.info("Database initialization completed successfully")
        
        # Create Flask app
        app = create_app()
        
        # Run the application
        logger.info("Starting TaskFlux API server...")
        logger.info(f"Server running on: http://localhost:5000")
        logger.info(f"Health check: http://localhost:5000/api/health")
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=Config.DEBUG
        )
        
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        print(f"❌ Error: {e}")
        input("Press Enter to exit...")
        raise e