#!/usr/bin/env python3
"""
Database Connection Test Script
Run this script to test your MySQL database connection before starting the main application.
"""

import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import db_manager
from config import Config

def test_database_connection():
    """Test the database connection and setup."""
    print("=" * 50)
    print("Task Manager - Database Connection Test")
    print("=" * 50)
    
    # Display configuration
    config = Config()
    print(f"Database Host: {config.DB_HOST}")
    print(f"Database Port: {config.DB_PORT}")
    print(f"Database Name: {config.DB_NAME}")
    print(f"Database User: {config.DB_USER}")
    print(f"Password: {'*' * len(config.DB_PASSWORD) if config.DB_PASSWORD else 'NOT SET'}")
    print("-" * 50)
    
    # Test connection
    print("Testing database connection...")
    success, message = db_manager.test_connection()
    
    if success:
        print(" Database connection successful!")
        print(f"Message: {message}")
        
        # Test table creation
        print("\nCreating tables...")
        success, message = db_manager.create_tables()
        
        if success:
            print("Tables created successfully!")
            print(f"Message: {message}")
            
            # Test sample query
            print("\nTesting sample query...")
            tasks, error = db_manager.execute_query(
                "SELECT COUNT(*) as total FROM Tasks", 
                fetch_one=True
            )
            
            if error:
                print(f" Query error: {error}")
            else:
                print(f" Query successful! Total tasks: {tasks['total']}")
                
                # Show sample tasks
                print("\nSample tasks in database:")
                all_tasks, error = db_manager.execute_query(
                    "SELECT Id, Title, IsCompleted FROM Tasks LIMIT 5", 
                    fetch_all=True
                )
                
                if error:
                    print(f" Error fetching tasks: {error}")
                else:
                    for task in all_tasks:
                        status = "" if task['IsCompleted'] else "⏳"
                        print(f"  {status} {task['Id']}. {task['Title']}")
        else:
            print(f" Table creation failed: {message}")
            return False
            
    else:
        print(f" Database connection failed: {message}")
        print("\nTroubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check your database credentials in .env file")
        print("3. Ensure the database 'task_manager' exists")
        print("4. Verify MySQL user has proper permissions")
        return False
    
    print("\n" + "=" * 50)
    print("Database test completed successfully!")
    print("You can now run the main Flask application.")
    print("=" * 50)
    
    # Close connection
    db_manager.close_connection()
    return True

if __name__ == "__main__":
    try:
        test_database_connection()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n Unexpected error: {e}")
        sys.exit(1)