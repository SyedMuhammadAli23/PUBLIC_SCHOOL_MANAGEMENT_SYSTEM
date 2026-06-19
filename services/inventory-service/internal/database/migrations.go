package database

import (
	"database/sql"
	"log"
)

func InitSchema(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS assets (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			category VARCHAR(100) NOT NULL,
			quantity INT NOT NULL,
			location VARCHAR(255) NOT NULL,
			status VARCHAR(50) NOT NULL,
			purchase_date DATE NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("Schema init error: %v", err)
	}
}
