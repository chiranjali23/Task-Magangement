import mysql.connector
from mysql.connector import Error
import logging
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Database connection and management class."""
    
    def __init__(self, config=None):
        self.config = config or Config()
        self._connection = None
    
    def get_connection(self):
        """Get database connection."""
        try:
            if self._connection is None or not self._connection.is_connected():
                self._connection = mysql.connector.connect(**self.config.DATABASE_CONFIG)
                logger.info("Connected to MySQL database successfully")
            return self._connection
        except Error as e:
            logger.error(f"Error connecting to MySQL database: {e}")
            return None
    
    def close_connection(self):
        """Close database connection."""
        if self._connection and self._connection.is_connected():
            self._connection.close()
            logger.info("MySQL connection closed")
    
    def test_connection(self):
        """Test database connection."""
        try:
            connection = self.get_connection()
            if connection and connection.is_connected():
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                cursor.close()
                return True, "Database connection successful"
            else:
                return False, "Failed to connect to database"
        except Error as e:
            return False, f"Database connection error: {e}"
    
    def create_tables(self):
        """Create database tables if they don't exist."""
        try:
            connection = self.get_connection()
            if not connection:
                return False, "No database connection"
            
            cursor = connection.cursor()
            
            # Create Tasks table
            create_table_query = """
            CREATE TABLE IF NOT EXISTS Tasks (
                Id INT AUTO_INCREMENT PRIMARY KEY,
                Title VARCHAR(255) NOT NULL,
                Description TEXT,
                IsCompleted BOOLEAN DEFAULT FALSE,
                CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_completed (IsCompleted),
                INDEX idx_created (CreatedAt)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            cursor.execute(create_table_query)
            connection.commit()
            
            logger.info("Tasks table created successfully")
            
            # Check if table is empty and insert sample data
            cursor.execute("SELECT COUNT(*) FROM Tasks")
            count = cursor.fetchone()[0]
            
            if count == 0:
                self.insert_sample_data(cursor, connection)
            
            cursor.close()
            return True, "Tables created successfully"
            
        except Error as e:
            logger.error(f"Error creating tables: {e}")
            return False, f"Error creating tables: {e}"
    
    def insert_sample_data(self, cursor, connection):
        """Insert sample data into Tasks table."""
        try:
            sample_tasks = [
                ('Setup Development Environment', 'Install Node.js, Python, Flask, React and create project structure', True),
                ('Create Database Schema', 'Design and implement the Tasks table with proper indexes', False),
                ('Build REST API', 'Implement CRUD endpoints for task management with error handling', False),
                ('Develop React Frontend', 'Create task list and add task components with routing', False),
                ('Write Documentation', 'Complete README with setup and usage instructions', False),
                ('Add Input Validation', 'Implement proper validation on both frontend and backend', False),
                ('Deploy Application', 'Deploy the app to a cloud platform like Heroku or AWS', False)
            ]
            
            insert_query = """
            INSERT INTO Tasks (Title, Description, IsCompleted) 
            VALUES (%s, %s, %s)
            """
            
            cursor.executemany(insert_query, sample_tasks)
            connection.commit()
            
            logger.info(f"Inserted {len(sample_tasks)} sample tasks")
            
        except Error as e:
            logger.error(f"Error inserting sample data: {e}")
    
    def execute_query(self, query, params=None, fetch_one=False, fetch_all=False):
        """Execute a database query safely."""
        try:
            connection = self.get_connection()
            if not connection:
                return None, "No database connection"
            
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            result = None
            if fetch_one:
                result = cursor.fetchone()
            elif fetch_all:
                result = cursor.fetchall()
            
            # For INSERT, UPDATE, DELETE operations
            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')):
                connection.commit()
                if query.strip().upper().startswith('INSERT'):
                    result = cursor.lastrowid
            
            cursor.close()
            return result, None
            
        except Error as e:
            logger.error(f"Database query error: {e}")
            return None, str(e)

# Global database instance
db_manager = DatabaseManager()