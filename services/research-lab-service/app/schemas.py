from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    title: str
    principal_investigator_id: int
    abstract: Optional[str] = None
    funding_amount: float
    status: Optional[str] = "active"

class PublicationCreate(BaseModel):
    project_id: Optional[int] = None
    title: str
    authors: str
    journal: str
    publication_date: str
    link: Optional[str] = None

class BookingCreate(BaseModel):
    lab_name: str
    researcher_id: int
    booking_date: str
    start_time: str
    end_time: str
    purpose: Optional[str] = None

class InventoryCreate(BaseModel):
    lab_name: str
    chemical_or_device_name: str
    quantity: float
    unit: str
    safety_warning: Optional[str] = None
