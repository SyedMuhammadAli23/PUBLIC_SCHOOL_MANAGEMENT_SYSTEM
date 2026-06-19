from sqlalchemy.orm import Session
from app import models
from datetime import datetime, date

def seed_mock_data(db: Session):
    if db.query(models.ParkingSlot).count() > 0:
        return
    
    print("Seeding parking and alumni...")
    slots = [
        models.ParkingSlot(slot_code="P-Newton-01", is_occupied=True, vehicle_number="XYZ-9876", allocated_to=2),
        models.ParkingSlot(slot_code="P-Newton-02", is_occupied=False),
        models.ParkingSlot(slot_code="P-Newton-03", is_occupied=False),
        models.ParkingSlot(slot_code="P-Turing-01", is_occupied=False),
        models.ParkingSlot(slot_code="P-Turing-02", is_occupied=False)
    ]
    db.add_all(slots)
    db.commit()

    alumni = [
        models.AlumniProfile(
            name="Elon Gates",
            email="elon.gates@alumni.asst.edu",
            graduation_year=2022,
            company="OpenAI",
            job_title="Senior Research Scientist",
            skills="Neural Networks, Python, Large Language Models",
            is_mentor=True
        ),
        models.AlumniProfile(
            name="Ada Lovelace Jr.",
            email="ada.love@alumni.asst.edu",
            graduation_year=2023,
            company="Google Quantum AI",
            job_title="Quantum Compiler Engineer",
            skills="Qiskit, C++, Superconductors",
            is_mentor=True
        )
    ]
    db.add_all(alumni)
    db.commit()

    event = models.AlumniEvent(
        title="ASST Annual Tech Symposium & Alumni Reunion 2026",
        description="Networking event, panels on Quantum Computing and AI Ethics, followed by dinner.",
        event_date=date(2026, 12, 18),
        location="Turing Grand Auditorium"
    )
    db.add(event)
    db.commit()

    donations = [
        models.Donation(donor_name="Google SciTech Grant", email="grants@google.com", amount=50000.0, payment_method="wire"),
        models.Donation(donor_name="Elon Gates", email="elon.gates@alumni.asst.edu", amount=1500.0, payment_method="stripe")
    ]
    db.add_all(donations)
    db.commit()

    ment = models.Mentorship(
        mentor_id=alumni[0].id,
        student_id=3,
        topic="Career advice in AI & Machine Learning",
        status="active"
    )
    db.add(ment)
    db.commit()
