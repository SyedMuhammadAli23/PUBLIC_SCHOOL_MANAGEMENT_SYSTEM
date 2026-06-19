from pydantic import BaseModel
from typing import Optional

class SlotAllocate(BaseModel):
    slot_code: str
    vehicle_number: str
    allocated_to: int

class AlumniCreate(BaseModel):
    name: str
    email: str
    graduation_year: int
    company: Optional[str] = None
    job_title: Optional[str] = None
    skills: Optional[str] = None
    is_mentor: Optional[bool] = False

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: str
    location: str

class DonationCreate(BaseModel):
    donor_name: str
    email: str
    amount: float
    payment_method: Optional[str] = "card"

class MentorshipCreate(BaseModel):
    mentor_id: int
    student_id: int
    topic: str
