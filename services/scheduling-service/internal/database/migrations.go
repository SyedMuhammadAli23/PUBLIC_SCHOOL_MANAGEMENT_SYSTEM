package database

import (
	"database/sql"
	"log"
)

func InitSchema(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS timetables (
			id SERIAL PRIMARY KEY,
			class_id INT NOT NULL,
			day_of_week VARCHAR(20) NOT NULL,
			start_time VARCHAR(10) NOT NULL,
			end_time VARCHAR(10) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS attendance (
			id SERIAL PRIMARY KEY,
			class_id INT NOT NULL,
			student_id INT NOT NULL,
			date DATE NOT NULL,
			status VARCHAR(20) NOT NULL,
			recorded_by INT NOT NULL,
			UNIQUE(class_id, student_id, date)
		);
	`)
	if err != nil {
		log.Fatalf("Schema init error: %v", err)
	}
}
