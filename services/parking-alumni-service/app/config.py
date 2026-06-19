import os
from pydantic import BaseModel

class Settings(BaseModel):
    PORT: str = os.getenv("PORT", "8003")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/parking_db")

settings = Settings()
