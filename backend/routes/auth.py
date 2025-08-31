# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)

from modules.user import User              # <-- your User model (modules/user.py)
from utils.security import SecurityUtils   # <-- helpers (utils/security.py)

import logging
logger = logging.getLogger(__name__)

# All endpoints will be under /api/auth/...
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        is_valid, message = SecurityUtils.validate_request_data(
            data, ["name", "email", "password"]
        )
        if not is_valid:
            return jsonify(success=False, message=message), 400

        name = SecurityUtils.sanitize_input(data.get("name"))
        email = SecurityUtils.sanitize_input(data.get("email"))
        password = data.get("password")

        user, msg = User.create_user(name, email, password)
        if user is None:
            # user already exists / validation error, etc.
            status = 409 if "exists" in (msg or "").lower() else 400
            return jsonify(success=False, message=msg), status

        access_token = create_access_token(identity=user.id)
        logger.info("User registered: %s", email)
        return jsonify(
            success=True,
            message="User registered successfully",
            user=user.to_dict(),
            access_token=access_token
        ), 201

    except Exception as e:
        logger.error("Registration error: %s", e)
        return jsonify(success=False, message="Internal server error"), 500


@auth_bp.post("/login")
def login():
    """Login user"""
    try:
        data = request.get_json()
        is_valid, message = SecurityUtils.validate_request_data(
            data, ["email", "password"]
        )
        if not is_valid:
            return jsonify(success=False, message=message), 400

        email = SecurityUtils.sanitize_input(data.get("email"))
        password = data.get("password")

        user = User.authenticate(email, password)
        if not user:
            return jsonify(success=False, message="Invalid email or password"), 401

        access_token = create_access_token(identity=user.id)
        logger.info("User logged in: %s", email)
        return jsonify(
            success=True,
            message="Login successful",
            user=user.to_dict(),
            access_token=access_token
        ), 200

    except Exception as e:
        logger.error("Login error: %s", e)
        return jsonify(success=False, message="Internal server error"), 500


@auth_bp.get("/profile")
@jwt_required()
def get_profile():
    """Get user profile (requires JWT)"""
    try:
        uid = get_jwt_identity()
        user = User.find_by_id(uid)
        if not user:
            return jsonify(success=False, message="User not found"), 404
        return jsonify(success=True, user=user.to_dict()), 200
    except Exception as e:
        logger.error("Get profile error: %s", e)
        return jsonify(success=False, message="Internal server error"), 500


@auth_bp.put("/profile")
@jwt_required()
def update_profile():
    """Update user profile (requires JWT)"""
    try:
        uid = get_jwt_identity()
        user = User.find_by_id(uid)
        if not user:
            return jsonify(success=False, message="User not found"), 404

        data = request.get_json() or {}
        name = SecurityUtils.sanitize_input(data.get("name")) if data.get("name") else None
        email = SecurityUtils.sanitize_input(data.get("email")) if data.get("email") else None

        ok, msg = user.update_profile(name, email)
        if not ok:
            return jsonify(success=False, message=msg), 400

        return jsonify(success=True, message=msg, user=user.to_dict()), 200
    except Exception as e:
        logger.error("Update profile error: %s", e)
        return jsonify(success=False, message="Internal server error"), 500


@auth_bp.post("/verify-token")
@jwt_required()
def verify_token():
    """Verify current JWT (requires JWT)"""
    try:
        uid = get_jwt_identity()
        user = User.find_by_id(uid)
        if not user:
            return jsonify(success=False, message="Invalid token"), 401
        return jsonify(success=True, message="Token is valid", user=user.to_dict()), 200
    except Exception as e:
        logger.error("Token verification error: %s", e)
        return jsonify(success=False, message="Token verification failed"), 401
