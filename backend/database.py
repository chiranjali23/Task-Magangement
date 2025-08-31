import mysql.connector
from mysql.connector import Error
from config import Config
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.config = Config.get_db_config()
        self.connection = None
        
    def connect(self):
        """Create database connection"""
        try:
            self.connection = mysql.connector.connect(**self.config)
            if self.connection.is_connected():
                logger.info("Successfully connected to MySQL database")
                return self.connection
        except Error as e:
            logger.error(f"Error connecting to MySQL: {e}")
            raise e
            
    def disconnect(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            logger.info("MySQL connection is closed")
            
    def execute_query(self, query, params=None, fetch=False):
        """Execute a database query"""
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()
                
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if fetch:
                if 'SELECT' in query.upper():
                    result = cursor.fetchall()
                else:
                    result = cursor.fetchone()
            else:
                result = cursor.rowcount
                
            cursor.close()
            return result
            
        except Error as e:
            logger.error(f"Error executing query: {e}")
            raise e
            
    def create_tables(self):
        """Create necessary database tables"""
        try:
            self.connect()
            
            # Users table
            users_table = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            # Tasks table (for future use)
            tasks_table = """
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
                priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
                due_date DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_due_date (due_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            # Execute table creation queries
            self.execute_query(users_table)
            self.execute_query(tasks_table)
            
            logger.info("Database tables created successfully")
            
        except Error as e:
            logger.error(f"Error creating tables: {e}")
            raise e
        finally:
            self.disconnect()

# Global database instance
db = Database()

def init_database():
    """Initialize database and create tables"""
    try:
        db.create_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise e

def get_db_connection():
    """Get a fresh database connection"""
    db.connect()
    return db