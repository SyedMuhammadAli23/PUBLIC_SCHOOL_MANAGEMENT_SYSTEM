from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime

def get_slots(db: Session):
    return db.query(models.ParkingSlot).all()

def allocate_slot(db: Session, data: schemas.SlotAllocate):
    slot = db.query(models.ParkingSlot).filter(models.ParkingSlot.slot_code == data.slot_code).first()
    if not slot:
        return None
    slot.is_occupied = True
    slot.vehicle_number = data.vehicle_number
    slot.allocated_to = data.allocated_to
    db.commit()
    db.refresh(slot)
    return slot

def release_slot(db: Session, slot_code: str):
    slot = db.query(models.ParkingSlot).filter(models.ParkingSlot.slot_code == slot_code).first()
    if not slot:
        return None
    slot.is_occupied = False
    slot.vehicle_number = None
    slot.allocated_to = None
    db.commit()
    return slot

def get_alumni(db: Session):
    return db.query(models.AlumniProfile).all()

def create_alumni(db: Session, data: schemas.AlumniCreate):
    db_obj = models.AlumniProfile(
        name=data.name,
        email=data.email,
        graduation_year=data.graduation_year,
        company=data.company,
        job_title=data.job_title,
        skills=data.skills,
        is_mentor=data.is_mentor
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_events(db: Session):
    return db.query(models.AlumniEvent).all()

def create_event(db: Session, data: schemas.EventCreate, ev_date):
    db_obj = models.AlumniEvent(
        title=data.title,
        description=data.description,
        event_date=ev_date,
        location=data.location
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_donations(db: Session):
    return db.query(models.Donation).order_by(models.Donation.donation_date.desc()).all()

def create_donation(db: Session, data: schemas.DonationCreate):
    db_obj = models.Donation(
        donor_name=data.donor_name,
        email=data.email,
        amount=data.amount,
        payment_method=data.payment_method,
        donation_date=datetime.now()
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_mentorships(db: Session, student_id: int = None, mentor_id: int = None):
    query = db.query(models.Mentorship)
    if student_id:
        query = query.filter(models.Mentorship.student_id == student_id)
    if mentor_id:
        query = query.filter(models.Mentorship.mentor_id == mentor_id)
    
    results = query.all()
    output = []
    for r in results:
        mentor = db.query(models.AlumniProfile).filter(models.AlumniProfile.id == r.mentor_id).first()
        output.append({
            "id": r.id,
            "mentor_id": r.mentor_id,
            "mentor_name": mentor.name if mentor else "Unknown Alumni",
            "mentor_email": mentor.email if mentor else "",
            "student_id": r.student_id,
            "topic": r.topic,
            "status": r.status
        })
    return output

def request_mentorship(db: Session, data: schemas.MentorshipCreate):
    db_obj = models.Mentorship(
        mentor_id=data.mentor_id,
        student_id=data.student_id,
        topic=data.topic,
        status="pending"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
