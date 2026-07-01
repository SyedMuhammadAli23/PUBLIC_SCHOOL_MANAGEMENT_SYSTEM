import time
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = None
Base = declarative_base()

for i in range(5):
    try:
        db_url = settings.DATABASE_URL

        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)

        engine = create_engine(db_url)

        with engine.connect():
            print("Connected to database successfully.")
            break

    except Exception as e:
        print(f"Database connection failed. Retry {i+1}/5. Error: {e}")
        time.sleep(2)

if engine is None:
    raise RuntimeError("Could not connect to database.")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()