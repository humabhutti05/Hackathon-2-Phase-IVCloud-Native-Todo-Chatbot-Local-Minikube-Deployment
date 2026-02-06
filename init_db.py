from backend.database import create_db_and_tables
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    logger.info("Initializing database and creating tables...")
    create_db_and_tables()
    logger.info("Database initialized successfully.")

if __name__ == "__main__":
    main()
