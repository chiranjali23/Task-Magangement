
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from modules.user import User
from utils.security import SecurityUtils
import logging
import traceback
from datetime import datetime

logger = logging.getLogger(__name__)

# Create Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with enhanced error handling"""
    try:
        logger.info(" Registration request received")
        
        # Get JSON data from request
        data = request.get_json()
        logger.info(f"Request data received: {data}")
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        is_valid, message = SecurityUtils.validate_request_data(data, required_fields)
        
        if not is_valid:
            logger.warning(f"Validation failed: {message}")
            return jsonify({
                'success': False,
                'message': message,
                'error_type': 'validation_error'
            }), 400
        
        # Sanitize input
        name = SecurityUtils.sanitize_input(data.get('name'))
        email = SecurityUtils.sanitize_input(data.get('email'))
        password = data.get('password')
        
        logger.info(f"Processing registration for: {email}")
        
        # Create user
        user, create_message = User.create_user(name, email, password)
        
        if user:
            # Create access token
            access_token = create_access_token(identity=user.id)
            
            logger.info(f"User registered successfully: {email} (ID: {user.id})")
            return jsonify({
                'success': True,
                'message': 'User registered successfully',
                'user': user.to_dict(),
                'access_token': access_token
            }), 201
        else:
            logger.warning(f"User creation failed: {create_message}")
            return jsonify({
                'success': False,
                'message': create_message,
                'error_type': 'user_creation_error'
            }), 400
            
    except Exception as e:
        # Log the full error traceback
        error_traceback = traceback.format_exc()
        logger.error(f"Registration error: {e}")
        logger.error(f"Full traceback: {error_traceback}")
        
        return jsonify({
            'success': False,
            'message': 'Internal server error occurred during registration',
            'error_type': 'internal_error',
            'debug_info': str(e) if logger.level <= logging.DEBUG else None
        }), 500

@auth_bp.route('/', methods=['POST'])
def login():
    """Login user with enhanced error handling"""
    try:
        logger.info("Login request received")
        
        # Get JSON data from request
        data = request.get_json()
        logger.info(f"Login attempt for: {data.get('email', 'unknown') if data else 'no data'}")
        
        # Validate required fields
        required_fields = ['email', 'password']
        is_valid, message = SecurityUtils.validate_request_data(data, required_fields)
        
        if not is_valid:
            logger.warning(f"Login validation failed: {message}")
            return jsonify({
                'success': False,
                'message': message,
                'error_type': 'validation_error'
            }), 400
        
        # Sanitize input
        email = SecurityUtils.sanitize_input(data.get('email'))
        password = data.get('password')
        
        # Authenticate user
        user = User.authenticate(email, password)
        
        if user:
            # Create access token
            access_token = create_access_token(identity=user.id)
            
            logger.info(f"User logged in successfully: {email}")
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': user.to_dict(),
                'access_token': access_token
            }), 200
        else:
            logger.warning(f"Login failed for: {email}")
            return jsonify({
                'success': False,
                'message': 'Invalid email or password',
                'error_type': 'authentication_error'
            }), 401
            
    except Exception as e:
        # Log the full error traceback
        error_traceback = traceback.format_exc()
        logger.error(f"Login error: {e}")
        logger.error(f"Full traceback: {error_traceback}")
        
        return jsonify({
            'success': False,
            'message': 'Internal server error occurred during login',
            'error_type': 'internal_error',
            'debug_info': str(e) if logger.level <= logging.DEBUG else None
        }), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile with enhanced error handling"""
    try:
        logger.info(" Profile request received")
        
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        logger.info(f"Profile request for user ID: {current_user_id}")
        
        # Find user by ID
        user = User.find_by_id(current_user_id)
        
        if user:
            logger.info(f"Profile retrieved for: {user.email}")
            return jsonify({
                'success': True,
                'user': user.to_dict()
            }), 200
        else:
            logger.warning(f"Profile not found for user ID: {current_user_id}")
            return jsonify({
                'success': False,
                'message': 'User not found',
                'error_type': 'user_not_found'
            }), 404
            
    except Exception as e:
        # Log the full error traceback
        error_traceback = traceback.format_exc()
        logger.error(f"Profile error: {e}")
        logger.error(f"Full traceback: {error_traceback}")
        
        return jsonify({
            'success': False,
            'message': 'Internal server error occurred while retrieving profile',
            'error_type': 'internal_error',
            'debug_info': str(e) if logger.level <= logging.DEBUG else None
        }), 500

# Test endpoint for debugging
@auth_bp.route('/test', methods=['GET', 'POST'])
def test_endpoint():
    """Test endpoint for debugging"""
    try:
        method = request.method
        data = request.get_json() if request.method == 'POST' else None
        
        logger.info(f"Test endpoint called with method: {method}")
        
        response_data = {
            'success': True,
            'message': 'Test endpoint working',
            'method': method,
            'data_received': data,
            'timestamp': str(datetime.now()) if 'datetime' in globals() else 'unknown'
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"Test endpoint error: {e}")
        return jsonify({
            'success': False,
            'message': f'Test endpoint error: {str(e)}'
        }), 500

# Error handlers for the auth blueprint
@auth_bp.errorhandler(422)
def handle_unprocessable_entity(e):
    """Handle JWT decode errors"""
    logger.warning(f"JWT decode error: {e}")
    return jsonify({
        'success': False,
        'message': 'Invalid token format',
        'error_type': 'jwt_error'
    }), 422

@auth_bp.errorhandler(401)
def handle_unauthorized(e):
    """Handle unauthorized access"""
    logger.warning(f"Unauthorized access: {e}")
    return jsonify({
        'success': False,
        'message': 'Authorization required',
        'error_type': 'authorization_error'
    }), 401

# Add this at the end of the file for debugging
print("routes/auth.py loaded successfully!")
logger.info("Auth routes module initialized")