package database

import (
	"database/sql"
	"log"
)

func InitSchema(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS fee_structures (
			id SERIAL PRIMARY KEY,
			class_name VARCHAR(100) NOT NULL,
			amount NUMERIC(10,2) NOT NULL,
			frequency VARCHAR(50) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS invoices (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			title VARCHAR(255) NOT NULL,
			amount NUMERIC(10,2) NOT NULL,
			due_date DATE NOT NULL,
			status VARCHAR(50) NOT NULL,
			paid_at TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS payroll (
			id SERIAL PRIMARY KEY,
			employee_id INT NOT NULL,
			role VARCHAR(100) NOT NULL,
			salary NUMERIC(10,2) NOT NULL,
			pay_date DATE NOT NULL,
			status VARCHAR(50) NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Schema init error: %v", err)
	}
}
