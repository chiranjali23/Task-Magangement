import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'Kodithuwakku#22')
    DB_NAME = os.getenv('DB_NAME', 'task_db')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '496f338a6d0bd305a9dea2002a6e13af3649090c3886f945007daf5ff5e95a51')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour in seconds
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'df029394d6e04965ab198e8f3e8f1bfa4cab259e2b550cf442efc1a24e1ab6b4')
    DEBUG = os.getenv('FLASK_ENV', 'production') == 'development'
    
    # CORS Configuration
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    @staticmethod
    def get_db_config():
        """Return database configuration as dictionary"""
        return {
            'host': Config.DB_HOST,
            'user': Config.DB_USER,
            'password': Config.DB_PASSWORD,
            'database': Config.DB_NAME,
            'autocommit': True,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci'
        }