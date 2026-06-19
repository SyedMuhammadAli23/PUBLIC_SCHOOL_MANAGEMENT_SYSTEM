package database

import (
	"database/sql"
	"log"
)

func InitSchema(db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS courses (
			id SERIAL PRIMARY KEY,
			code VARCHAR(50) UNIQUE NOT NULL,
			name VARCHAR(255) NOT NULL,
			description TEXT,
			credits INT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS classes (
			id SERIAL PRIMARY KEY,
			course_id INT REFERENCES courses(id) ON DELETE CASCADE,
			teacher_id INT NOT NULL,
			room VARCHAR(100) NOT NULL
		);
		CREATE TABLE IF NOT EXISTS enrollments (
			id SERIAL PRIMARY KEY,
			class_id INT REFERENCES classes(id) ON DELETE CASCADE,
			student_id INT NOT NULL,
			UNIQUE(class_id, student_id)
		);
		CREATE TABLE IF NOT EXISTS exams (
			id SERIAL PRIMARY KEY,
			course_id INT REFERENCES courses(id) ON DELETE CASCADE,
			title VARCHAR(255) NOT NULL,
			date DATE NOT NULL
		);
		CREATE TABLE IF NOT EXISTS marks (
			id SERIAL PRIMARY KEY,
			exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
			student_id INT NOT NULL,
			score NUMERIC(5,2) NOT NULL,
			max_score NUMERIC(5,2) NOT NULL,
			grader_id INT NOT NULL,
			graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(exam_id, student_id)
		);
	`)
	if err != nil {
		log.Fatalf("Error initializing schema: %v", err)
	}
}
