from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("/research/projects")
def get_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

@router.post("/research/projects", status_code=201)
def create_project(data: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db, data)

@router.get("/research/publications")
def get_publications(project_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_publications(db, project_id)

@router.post("/research/publications", status_code=201)
def create_publication(data: schemas.PublicationCreate, db: Session = Depends(get_db)):
    try:
        pub_date = datetime.strptime(data.publication_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date. Use YYYY-MM-DD")
    return crud.create_publication(db, data, pub_date)

@router.get("/labs/bookings")
def get_bookings(researcher_id: Optional[int] = None, db: Session = Depends(get_db)):
    return crud.get_bookings(db, researcher_id)

@router.post("/labs/bookings", status_code=201)
def create_booking(data: schemas.BookingCreate, db: Session = Depends(get_db)):
    try:
        book_date = datetime.strptime(data.booking_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date. Use YYYY-MM-DD")
    return crud.create_booking(db, data, book_date)

@router.get("/labs/inventory")
def get_inventory(lab_name: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_inventory(db, lab_name)

@router.post("/labs/inventory", status_code=201)
def add_inventory(data: schemas.InventoryCreate, db: Session = Depends(get_db)):
    return crud.add_inventory(db, data)
