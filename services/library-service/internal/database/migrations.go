package database

import (
	"database/sql"
	"log"
)

func InitSchema(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS books (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			author VARCHAR(255) NOT NULL,
			isbn VARCHAR(50) UNIQUE NOT NULL,
			category VARCHAR(100) NOT NULL,
			total_copies INT NOT NULL,
			available_copies INT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS borrows (
			id SERIAL PRIMARY KEY,
			user_id INT NOT NULL,
			book_id INT REFERENCES books(id) ON DELETE CASCADE,
			borrow_date DATE NOT NULL,
			due_date DATE NOT NULL,
			return_date DATE,
			fine_amount NUMERIC(8,2) DEFAULT 0.00
		);
	`)
	if err != nil {
		log.Fatalf("Schema init error: %v", err)
	}
}
