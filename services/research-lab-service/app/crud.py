from sqlalchemy.orm import Session
from app import models, schemas

def get_projects(db: Session):
    return db.query(models.ResearchProject).all()

def create_project(db: Session, data: schemas.ProjectCreate):
    db_obj = models.ResearchProject(
        title=data.title,
        principal_investigator_id=data.principal_investigator_id,
        abstract=data.abstract,
        funding_amount=data.funding_amount,
        status=data.status
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_publications(db: Session, project_id: int = None):
    if project_id:
        return db.query(models.Publication).filter(models.Publication.project_id == project_id).all()
    return db.query(models.Publication).all()

def create_publication(db: Session, data: schemas.PublicationCreate, pub_date):
    db_obj = models.Publication(
        project_id=data.project_id,
        title=data.title,
        authors=data.authors,
        journal=data.journal,
        publication_date=pub_date,
        link=data.link
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_bookings(db: Session, researcher_id: int = None):
    if researcher_id:
        return db.query(models.LabBooking).filter(models.LabBooking.researcher_id == researcher_id).all()
    return db.query(models.LabBooking).all()

def create_booking(db: Session, data: schemas.BookingCreate, book_date):
    db_obj = models.LabBooking(
        lab_name=data.lab_name,
        researcher_id=data.researcher_id,
        booking_date=book_date,
        start_time=data.start_time,
        end_time=data.end_time,
        purpose=data.purpose
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_inventory(db: Session, lab_name: str = None):
    if lab_name:
        return db.query(models.LabInventory).filter(models.LabInventory.lab_name.ilike(f"%{lab_name}%")).all()
    return db.query(models.LabInventory).all()

def add_inventory(db: Session, data: schemas.InventoryCreate):
    db_obj = models.LabInventory(
        lab_name=data.lab_name,
        chemical_or_device_name=data.chemical_or_device_name,
        quantity=data.quantity,
        unit=data.unit,
        safety_warning=data.safety_warning
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
