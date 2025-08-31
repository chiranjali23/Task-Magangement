# utils/security.py
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class SecurityUtils:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain password."""
        return bcrypt.generate_password_hash(password).decode("utf-8")

    @staticmethod
    def check_password(password_hash: str, password: str) -> bool:
        """Check if password matches stored hash."""
        return bcrypt.check_password_hash(password_hash, password)
