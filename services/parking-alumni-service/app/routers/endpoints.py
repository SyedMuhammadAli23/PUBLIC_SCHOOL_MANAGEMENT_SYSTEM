from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app import schemas, crud, models
from app.database import get_db

router = APIRouter()


# --------------------------
# Health
# --------------------------

@router.get("/api/parking/health")
def health():
    return {"status": "UP", "service": "Parking & Alumni Service"}


# --------------------------
# Parking
# --------------------------

@router.get("/api/parking/parking/slots")
def get_slots(db: Session = Depends(get_db)):
    return crud.get_slots(db)


@router.post("/api/parking/parking/allocate")
def allocate_slot(data: schemas.SlotAllocate, db: Session = Depends(get_db)):
    slot = crud.allocate_slot(db, data)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    return slot


@router.post("/api/parking/parking/release")
def release_slot(req: dict, db: Session = Depends(get_db)):
    slot_code = req.get("slot_code")
    if not slot_code:
        raise HTTPException(status_code=400, detail="slot_code is required")

    slot = crud.release_slot(db, slot_code)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    return {
        "message": f"Parking slot {slot_code} released successfully"
    }


# --------------------------
# Alumni
# --------------------------

@router.get("/api/parking/alumni/directory")
def get_alumni(db: Session = Depends(get_db)):
    return crud.get_alumni(db)


@router.post("/api/parking/alumni/directory", status_code=201)
def create_alumni(data: schemas.AlumniCreate, db: Session = Depends(get_db)):
    return crud.create_alumni(db, data)


@router.get("/api/parking/alumni/events")
def get_events(db: Session = Depends(get_db)):
    return crud.get_events(db)


@router.post("/api/parking/alumni/events", status_code=201)
def create_event(data: schemas.EventCreate, db: Session = Depends(get_db)):
    try:
        ev_date = datetime.strptime(
            data.event_date,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date. Use YYYY-MM-DD",
        )

    return crud.create_event(db, data, ev_date)


@router.get("/api/parking/alumni/donations")
def get_donations(db: Session = Depends(get_db)):
    return crud.get_donations(db)


@router.post("/api/parking/alumni/donations", status_code=201)
def create_donation(data: schemas.DonationCreate, db: Session = Depends(get_db)):
    return crud.create_donation(db, data)


@router.get("/api/parking/alumni/mentorships")
def get_mentorships(
    student_id: Optional[int] = None,
    mentor_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return crud.get_mentorships(db, student_id, mentor_id)


@router.post("/api/parking/alumni/mentorships", status_code=201)
def request_mentorship(
    data: schemas.MentorshipCreate,
    db: Session = Depends(get_db),
):
    mentor = (
        db.query(models.AlumniProfile)
        .filter(models.AlumniProfile.id == data.mentor_id)
        .first()
    )

    if not mentor:
        raise HTTPException(
            status_code=404,
            detail="Mentor not found in alumni directory",
        )

    return crud.request_mentorship(db, data)