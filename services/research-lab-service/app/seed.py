from sqlalchemy.orm import Session
from app import models
from datetime import date

def seed_mock_data(db: Session):
    if db.query(models.ResearchProject).count() > 0:
        return
    
    print("Seeding research and labs...")
    proj1 = models.ResearchProject(
        title="High-Temperature Quantum Superconductors study",
        principal_investigator_id=2, # Professor Doe
        abstract="Investigating the transition temperature of copper-oxide ceramics under high magnetic fields to achieve zero resistance close to room temperature.",
        funding_amount=75000.0,
        status="active"
    )
    proj2 = models.ResearchProject(
        title="Deep Neural Networks for CRISPR Target Design",
        principal_investigator_id=2,
        abstract="Applying advanced transformer models to predict off-target mutations and efficiency of CRISPR guide RNAs in eukaryotic genomes.",
        funding_amount=120000.0,
        status="active"
    )
    db.add(proj1)
    db.add(proj2)
    db.commit()

    pub1 = models.Publication(
        project_id=proj1.id,
        title="Topological Waveguides and Quantum Resistance Nodes in Cuprates",
        authors="John Doe, Alex Smith, Sarah Connor",
        journal="Journal of Quantum Science and Materials",
        publication_date=date(2026, 4, 15),
        link="https://doi.org/10.1038/qsci.2026.42"
    )
    db.add(pub1)
    db.commit()

    booking1 = models.LabBooking(
        lab_name="Curie Physics Lab B",
        researcher_id=2,
        booking_date=date(2026, 6, 24),
        start_time="13:00",
        end_time="17:00",
        purpose="Superconductivity cryostat resistance testing"
    )
    db.add(booking1)
    db.commit()

    inv1 = models.LabInventory(
        lab_name="Curie Physics Lab B",
        chemical_or_device_name="Liquid Nitrogen Dewars",
        quantity=50.0,
        unit="litres",
        safety_warning="Cryogenic hazard. Requires thermal gloves and face shield."
    )
    inv2 = models.LabInventory(
        lab_name="Darwin Wet Lab 104",
        chemical_or_device_name="Agarose Powder (Genetic Grade)",
        quantity=500.0,
        unit="grams",
        safety_warning="Standard lab protocol. Avoid inhalation."
    )
    inv3 = models.LabInventory(
        lab_name="Newton Computer Lab",
        chemical_or_device_name="Oculus Rift VR Devkits",
        quantity=8.0,
        unit="units",
        safety_warning="IT asset checklist."
    )
    db.add_all([inv1, inv2, inv3])
    db.commit()
