package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM assets").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding school assets...")
	_, err := db.Exec(`
		INSERT INTO assets (name, category, quantity, location, status, purchase_date) VALUES
		('Nvidia DGX A100 GPU Server', 'IT Equipment', 1, 'Newton Server Room 302', 'active', '2026-01-15'),
		('Thermo Scientific Laboratory Refrigerator', 'Lab Equipment', 2, 'Darwin Wet Lab 104', 'active', '2026-03-22'),
		('High-Grade Borosilicate Beakers Set (50pcs)', 'Lab Consumables', 5, 'Chemistry Lab 102', 'active', '2026-05-10'),
		('Interactive LCD Smartboards', 'Furniture & Classroom', 12, 'Newton Lab / Turing Hall', 'active', '2026-02-18'),
		('Student Ergonomic Chairs', 'Furniture & Classroom', 120, 'All Classrooms', 'active', '2026-02-10');
	`)
	if err != nil {
		log.Println("Error seeding assets:", err)
	}
}
