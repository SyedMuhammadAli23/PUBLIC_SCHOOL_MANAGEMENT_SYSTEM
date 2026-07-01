import os
from pydantic import BaseModel


class Settings(BaseModel):
    PORT: str = os.getenv("PORT", "8001")

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/quiz_db"
    )


settings = Settings()