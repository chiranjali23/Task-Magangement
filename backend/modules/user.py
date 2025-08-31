from database import get_db_connection
from flask_bcrypt import Bcrypt
import re
import logging

logger = logging.getLogger(__name__)
bcrypt = Bcrypt()

class User:
    def __init__(self, user_id=None, name=None, email=None, password_hash=None, 
                 is_active=True, created_at=None, updated_at=None):
        self.id = user_id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.is_active = is_active
        self.created_at = created_at
        self.updated_at = updated_at
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        if len(password) > 128:
            return False, "Password must be less than 128 characters"
        return True, "Password is valid"
    
    @staticmethod
    def validate_name(name):
        """Validate name"""
        if not name or len(name.strip()) < 2:
            return False, "Name must be at least 2 characters long"
        if len(name) > 100:
            return False, "Name must be less than 100 characters"
        return True, "Name is valid"
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        return bcrypt.generate_password_hash(password).decode('utf-8')
    
    @staticmethod
    def check_password(password_hash, password):
        """Check if password matches hash"""
        return bcrypt.check_password_hash(password_hash, password)
    
    @classmethod
    def create_user(cls, name, email, password):
        """Create a new user in database"""
        try:
            # Validate input data
            if not cls.validate_name(name)[0]:
                return None, cls.validate_name(name)[1]
            
            if not cls.validate_email(email):
                return None, "Invalid email format"
            
            is_valid_password, password_message = cls.validate_password(password)
            if not is_valid_password:
                return None, password_message
            
            # Check if user already exists
            if cls.find_by_email(email):
                return None, "User with this email already exists"
            
            # Hash password
            password_hash = cls.hash_password(password)
            
            # Insert user into database
            db = get_db_connection()
            query = """
                INSERT INTO users (name, email, password_hash) 
                VALUES (%s, %s, %s)
            """
            db.execute_query(query, (name.strip(), email.lower().strip(), password_hash))
            
            # Get the created user
            user = cls.find_by_email(email)
            logger.info(f"User created successfully: {email}")
            
            return user, "User created successfully"
            
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None, f"Error creating user: {str(e)}"
    
    @classmethod
    def find_by_email(cls, email):
        """Find user by email"""
        try:
            db = get_db_connection()
            query = "SELECT * FROM users WHERE email = %s AND is_active = TRUE"
            result = db.execute_query(query, (email.lower().strip(),), fetch=True)
            
            if result:
                user_data = result[0]  # fetchall returns list, get first item
                return cls(
                    user_id=user_data['id'],
                    name=user_data['name'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    is_active=user_data['is_active'],
                    created_at=user_data['created_at'],
                    updated_at=user_data['updated_at']
                )
            return None
            
        except Exception as e:
            logger.error(f"Error finding user by email: {e}")
            return None
    
    @classmethod
    def find_by_id(cls, user_id):
        """Find user by ID"""
        try:
            db = get_db_connection()
            query = "SELECT * FROM users WHERE id = %s AND is_active = TRUE"
            result = db.execute_query(query, (user_id,), fetch=True)
            
            if result:
                user_data = result[0]
                return cls(
                    user_id=user_data['id'],
                    name=user_data['name'],
                    email=user_data['email'],
                    password_hash=user_data['password_hash'],
                    is_active=user_data['is_active'],
                    created_at=user_data['created_at'],
                    updated_at=user_data['updated_at']
                )
            return None
            
        except Exception as e:
            logger.error(f"Error finding user by ID: {e}")
            return None
    
    @classmethod
    def authenticate(cls, email, password):
        """Authenticate user with email and password"""
        try:
            user = cls.find_by_email(email)
            if user and cls.check_password(user.password_hash, password):
                logger.info(f"User authenticated successfully: {email}")
                return user
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return None
    
    def update_profile(self, name=None, email=None):
        """Update user profile"""
        try:
            updates = []
            params = []
            
            if name and self.validate_name(name)[0]:
                updates.append("name = %s")
                params.append(name.strip())
                self.name = name.strip()
            
            if email and self.validate_email(email):
                # Check if email is already taken by another user
                existing_user = self.find_by_email(email)
                if existing_user and existing_user.id != self.id:
                    return False, "Email is already taken"
                updates.append("email = %s")
                params.append(email.lower().strip())
                self.email = email.lower().strip()
            
            if updates:
                params.append(self.id)
                db = get_db_connection()
                query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
                db.execute_query(query, params)
                logger.info(f"User profile updated: {self.email}")
                return True, "Profile updated successfully"
            
            return False, "No valid updates provided"
            
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
            return False, f"Error updating profile: {str(e)}"
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"