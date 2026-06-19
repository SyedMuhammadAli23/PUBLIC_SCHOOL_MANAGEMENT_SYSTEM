from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.database import Base

class ParkingSlot(Base):
    __tablename__ = "parking_slots"
    id = Column(Integer, primary_key=True, index=True)
    slot_code = Column(String(50), unique=True, nullable=False)
    is_occupied = Column(Boolean, default=False)
    vehicle_number = Column(String(100), nullable=True)
    allocated_to = Column(Integer, nullable=True) # User ID

class AlumniProfile(Base):
    __tablename__ = "alumni_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    company = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    skills = Column(String(255), nullable=True)
    is_mentor = Column(Boolean, default=False)

class AlumniEvent(Base):
    __tablename__ = "alumni_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(Date, nullable=False)
    location = Column(String(255), nullable=False)

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(100), default="stripe")
    donation_date = Column(DateTime, default=datetime.utcnow)

class Mentorship(Base):
    __tablename__ = "mentorships"
    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("alumni_profiles.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, nullable=False)
    topic = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")
