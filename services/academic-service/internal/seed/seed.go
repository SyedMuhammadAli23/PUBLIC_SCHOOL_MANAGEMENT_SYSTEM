package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM courses").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding academic data...")
	_, err := db.Exec(`
		INSERT INTO courses (code, name, description, credits) VALUES
		('CS-101', 'Introduction to Computer Science & Python', 'Fundamental programming concepts using Python.', 3),
		('CS-402', 'Artificial Intelligence & Neural Networks', 'Advanced concepts in Deep Learning, CNNs, and transformers.', 4),
		('PHYS-301', 'Quantum Mechanics & Modern Physics', 'Wave mechanics, Schrodinger equation, and quantum applications.', 4),
		('BIO-201', 'Genomics & Biotech Lab', 'Introductory genetic engineering and laboratory procedures.', 3);
	`)
	if err != nil {
		log.Println("Error seeding courses:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO classes (course_id, teacher_id, room) VALUES
		(1, 2, 'Newton Lab 202'),
		(2, 2, 'Turing Hall A'),
		(3, 2, 'Curie Hall B'),
		(4, 2, 'Darwin Wet Lab 104');
	`)
	if err != nil {
		log.Println("Error seeding classes:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO enrollments (class_id, student_id) VALUES
		(1, 3),
		(2, 3),
		(3, 3),
		(4, 3);
	`)
	if err != nil {
		log.Println("Error seeding enrollments:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO exams (course_id, title, date) VALUES
		(1, 'Python Midterm', '2026-07-15'),
		(2, 'Neural Network Design Project', '2026-07-20'),
		(3, 'Quantum Mechanics Exam 1', '2026-07-22');
	`)
	if err != nil {
		log.Println("Error seeding exams:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO marks (exam_id, student_id, score, max_score, grader_id) VALUES
		(1, 3, 95.0, 100.0, 2),
		(2, 3, 48.0, 50.0, 2);
	`)
	if err != nil {
		log.Println("Error seeding marks:", err)
	}
}
