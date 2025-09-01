# Minimal database.py for testing
import logging

logger = logging.getLogger(__name__)

def init_database():
    logger.info("Database initialized (minimal version)")
    print("✅ Database initialized (minimal version)")
    return True

def get_db_connection():
    logger.info("Database connection requested (minimal version)")
    return None

print("✅ utils/database.py loaded successfully")
