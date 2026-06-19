from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.routers.endpoints import router as api_router
from app.seed import seed_mock_data

# Create tables
Base.metadata.create_all(bind=engine)

# Seed mock data
db = SessionLocal()
try:
    seed_mock_data(db)
finally:
    db.close()

app = FastAPI(title="Assignment & Quiz Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/health")
def health():
    return {"status": "UP", "service": "Assignment & Quiz Service"}
