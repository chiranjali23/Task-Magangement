#!/usr/bin/env python3
"""
Database Connection Test Script
Run this script to test your MySQL database connection before starting the main application.
"""

import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db, init_database
from config import Config

def test_database_connection():
    """Test the database connection and setup."""
    print("=" * 50)
    print("TaskFlux - Database Connection Test")
    print("=" * 50)
    
    # Display configuration
    print(f"Database Host: {Config.DB_HOST}")
    print(f"Database Name: {Config.DB_NAME}")
    print(f"Database User: {Config.DB_USER}")
    print(f"Password: {'*' * len(Config.DB_PASSWORD) if Config.DB_PASSWORD else 'NOT SET'}")
    print("-" * 50)
    
    try:
        # Test connection
        print("Testing database connection...")
        db.connect()
        print("✅ Database connection successful!")
        
        # Test table creation
        print("\nCreating tables...")
        init_database()
        print("✅ Tables created successfully!")
        
        # Test sample query on users table
        print("\nTesting sample query...")
        result = db.execute_query("SELECT COUNT(*) as total FROM users", fetch=True)
        
        if result:
            total_users = result[0]['total']
            print(f"✅ Query successful! Total users: {total_users}")
            
            # Show sample users
            if total_users > 0:
                print("\nSample users in database:")
                users = db.execute_query(
                    "SELECT id, name, email, created_at FROM users LIMIT 5", 
                    fetch=True
                )
                
                for user in users:
                    print(f"  👤 {user['id']}. {user['name']} ({user['email']})")
            else:
                print("No users found in database")
                
        # Test tasks table
        print("\nTesting tasks table...")
        result = db.execute_query("SELECT COUNT(*) as total FROM tasks", fetch=True)
        
        if result:
            total_tasks = result[0]['total']
            print(f"✅ Tasks table accessible! Total tasks: {total_tasks}")
            
            if total_tasks > 0:
                print("\nSample tasks in database:")
                tasks = db.execute_query(
                    "SELECT id, title, status, priority FROM tasks LIMIT 5", 
                    fetch=True
                )
                
                for task in tasks:
                    status_icon = "✅" if task['status'] == 'completed' else "⏳" if task['status'] == 'in_progress' else "📝"
                    print(f"  {status_icon} {task['id']}. {task['title']} ({task['priority']} priority)")
            else:
                print("No tasks found in database")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check your database credentials in .env file")
        print(f"3. Ensure the database '{Config.DB_NAME}' exists")
        print("4. Verify MySQL user has proper permissions")
        print("5. Install required dependencies: pip install -r requirements.txt")
        return False
    finally:
        # Close connection
        db.disconnect()
    
    print("\n" + "=" * 50)
    print("Database test completed successfully!")
    print("You can now run the main Flask application with: python app.py")
    print("=" * 50)
    return True

if __name__ == "__main__":
    try:
        test_database_connection()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)