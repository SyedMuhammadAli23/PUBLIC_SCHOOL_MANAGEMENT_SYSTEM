package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM timetables").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding scheduling data...")
	_, err := db.Exec(`
		INSERT INTO timetables (class_id, day_of_week, start_time, end_time) VALUES
		(1, 'Monday', '09:00', '10:30'),
		(1, 'Wednesday', '09:00', '10:30'),
		(2, 'Monday', '11:00', '12:30'),
		(2, 'Wednesday', '11:00', '12:30'),
		(3, 'Tuesday', '10:00', '11:30'),
		(3, 'Thursday', '10:00', '11:30'),
		(4, 'Friday', '14:00', '17:00');
	`)
	if err != nil {
		log.Println("Error seeding timetables:", err)
	}

	_, err = db.Exec(`
		INSERT INTO attendance (class_id, student_id, date, status, recorded_by) VALUES
		(1, 3, '2026-06-15', 'present', 2),
		(1, 3, '2026-06-17', 'present', 2),
		(2, 3, '2026-06-15', 'late', 2),
		(2, 3, '2026-06-17', 'present', 2);
	`)
	if err != nil {
		log.Println("Error seeding attendance:", err)
	}
}
