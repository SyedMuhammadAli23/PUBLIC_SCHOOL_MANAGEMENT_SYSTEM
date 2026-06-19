package repository

import (
	"database/sql"
	"time"
	"scheduling-service/internal/models"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{db: db}
}

var courseNames = map[int]string{
	1: "CS-101 (Intro to CS)",
	2: "CS-402 (AI & Neural Networks)",
	3: "PHYS-301 (Quantum Mechanics)",
	4: "BIO-201 (Genomics Lab)",
}

var rooms = map[int]string{
	1: "Newton Lab 202",
	2: "Turing Hall A",
	3: "Curie Hall B",
	4: "Darwin Wet Lab 104",
}

func (r *Repository) GetTimetables(studentID, teacherID int) ([]models.Timetable, error) {
	var rows *sql.Rows
	var err error
	
	if studentID > 0 || teacherID > 0 {
		rows, err = r.db.Query("SELECT id, class_id, day_of_week, start_time, end_time FROM timetables WHERE class_id IN (1,2,3,4)")
	} else {
		rows, err = r.db.Query("SELECT id, class_id, day_of_week, start_time, end_time FROM timetables")
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	timetables := []models.Timetable{}
	for rows.Next() {
		var t models.Timetable
		rows.Scan(&t.ID, &t.ClassID, &t.DayOfWeek, &t.StartTime, &t.EndTime)
		t.Course = courseNames[t.ClassID]
		t.Room = rooms[t.ClassID]
		timetables = append(timetables, t)
	}
	return timetables, nil
}

func (r *Repository) CreateTimetable(t models.Timetable) (models.Timetable, error) {
	err := r.db.QueryRow(
		"INSERT INTO timetables (class_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING id",
		t.ClassID, t.DayOfWeek, t.StartTime, t.EndTime,
	).Scan(&t.ID)
	return t, err
}

func (r *Repository) GetAttendance(studentID, classID int) ([]models.Attendance, error) {
	var rows *sql.Rows
	var err error

	if studentID > 0 {
		rows, err = r.db.Query("SELECT id, class_id, student_id, date, status, recorded_by FROM attendance WHERE student_id = $1", studentID)
	} else if classID > 0 {
		rows, err = r.db.Query("SELECT id, class_id, student_id, date, status, recorded_by FROM attendance WHERE class_id = $1", classID)
	} else {
		rows, err = r.db.Query("SELECT id, class_id, student_id, date, status, recorded_by FROM attendance")
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	attendanceList := []models.Attendance{}
	for rows.Next() {
		var a models.Attendance
		var dateVal time.Time
		rows.Scan(&a.ID, &a.ClassID, &a.StudentID, &dateVal, &a.Status, &a.RecordedBy)
		a.Date = dateVal.Format("2006-01-02")
		a.Course = courseNames[a.ClassID]
		attendanceList = append(attendanceList, a)
	}
	return attendanceList, nil
}

func (r *Repository) SaveAttendance(a models.Attendance) (models.Attendance, error) {
	if a.Date == "" {
		a.Date = time.Now().Format("2006-01-02")
	}
	err := r.db.QueryRow(
		`INSERT INTO attendance (class_id, student_id, date, status, recorded_by) 
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (class_id, student_id, date) 
		 DO UPDATE SET status = EXCLUDED.status, recorded_by = EXCLUDED.recorded_by
		 RETURNING id`,
		a.ClassID, a.StudentID, a.Date, a.Status, a.RecordedBy,
	).Scan(&a.ID)
	return a, err
}
