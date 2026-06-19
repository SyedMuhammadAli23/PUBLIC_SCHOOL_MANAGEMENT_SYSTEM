from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey
from app.database import Base

class ResearchProject(Base):
    __tablename__ = "research_projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    principal_investigator_id = Column(Integer, nullable=False)
    abstract = Column(Text, nullable=True)
    funding_amount = Column(Float, default=0.0)
    status = Column(String(50), default="active") # 'active', 'completed', 'proposal'

class Publication(Base):
    __tablename__ = "publications"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    authors = Column(String(255), nullable=False)
    journal = Column(String(255), nullable=False)
    publication_date = Column(Date, nullable=False)
    link = Column(String(255), nullable=True)

class LabBooking(Base):
    __tablename__ = "lab_bookings"
    id = Column(Integer, primary_key=True, index=True)
    lab_name = Column(String(100), nullable=False)
    researcher_id = Column(Integer, nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    purpose = Column(Text, nullable=True)

class LabInventory(Base):
    __tablename__ = "lab_inventories"
    id = Column(Integer, primary_key=True, index=True)
    lab_name = Column(String(100), nullable=False)
    chemical_or_device_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False) # 'litres', 'grams', 'units'
    safety_warning = Column(Text, nullable=True)
