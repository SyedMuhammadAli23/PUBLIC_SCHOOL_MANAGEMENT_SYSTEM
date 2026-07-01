from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.routers.endpoints import router as api_router
from app.seed import seed_mock_data

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_mock_data(db)
finally:
    db.close()

app = FastAPI(title="Parking & Alumni Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


# ALB Health Check
@app.get("/health")
def health():
    return {"status": "UP", "service": "Parking & Alumni Service"}


# Public Health Endpoint
@app.get("/api/parking/health")
def api_health():
    return {"status": "UP", "service": "Parking & Alumni Service"}