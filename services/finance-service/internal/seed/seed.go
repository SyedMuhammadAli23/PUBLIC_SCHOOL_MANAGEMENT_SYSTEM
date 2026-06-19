package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM fee_structures").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding finance structures...")
	_, err := db.Exec(`
		INSERT INTO fee_structures (class_name, amount, frequency) VALUES
		('Quantum Physics & SciTech Tuition', 12000.00, 'semester'),
		('Biotech Lab Consumables fee', 250.00, 'one-time'),
		('High-Performance Computing Allocation', 500.00, 'annual');
	`)
	if err != nil {
		log.Println("Error seeding fee_structures:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO invoices (user_id, title, amount, due_date, status) VALUES
		(3, 'Tuition Invoice - Fall 2026', 12000.00, '2026-09-01', 'unpaid'),
		(3, 'Laboratory Equipment Maintenance Fee', 250.00, '2026-06-30', 'unpaid');
	`)
	if err != nil {
		log.Println("Error seeding invoices:", err)
	}

	_, err = db.Exec(`
		INSERT INTO payroll (employee_id, role, salary, pay_date, status) VALUES
		(2, 'Professor - Science & Tech Dept', 6500.00, '2026-05-31', 'processed'),
		(2, 'Professor - Science & Tech Dept', 6500.00, '2026-06-30', 'pending');
	`)
	if err != nil {
		log.Println("Error seeding payroll:", err)
	}
}
