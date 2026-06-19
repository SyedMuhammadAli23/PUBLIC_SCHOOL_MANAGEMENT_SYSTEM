package repository

import (
	"database/sql"
	"time"
	"academic-service/internal/models"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetCourses() ([]models.Course, error) {
	rows, err := r.db.Query("SELECT id, code, name, description, credits FROM courses")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	courses := []models.Course{}
	for rows.Next() {
		var c models.Course
		rows.Scan(&c.ID, &c.Code, &c.Name, &c.Description, &c.Credits)
		courses = append(courses, c)
	}
	return courses, nil
}

func (r *Repository) CreateCourse(c models.Course) (models.Course, error) {
	err := r.db.QueryRow(
		"INSERT INTO courses (code, name, description, credits) VALUES ($1, $2, $3, $4) RETURNING id",
		c.Code, c.Name, c.Description, c.Credits,
	).Scan(&c.ID)
	return c, err
}

func (r *Repository) GetClasses() ([]models.Class, error) {
	rows, err := r.db.Query(`
		SELECT cl.id, cl.course_id, co.name, cl.teacher_id, cl.room 
		FROM classes cl
		JOIN courses co ON cl.course_id = co.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	classes := []models.Class{}
	for rows.Next() {
		var cl models.Class
		rows.Scan(&cl.ID, &cl.CourseID, &cl.Course, &cl.TeacherID, &cl.Room)
		classes = append(classes, cl)
	}
	return classes, nil
}

func (r *Repository) CreateClass(cl models.Class) (models.Class, error) {
	err := r.db.QueryRow(
		"INSERT INTO classes (course_id, teacher_id, room) VALUES ($1, $2, $3) RETURNING id",
		cl.CourseID, cl.TeacherID, cl.Room,
	).Scan(&cl.ID)
	return cl, err
}

func (r *Repository) GetEnrollments(studentID int) ([]models.Enrollment, error) {
	var rows *sql.Rows
	var err error
	if studentID > 0 {
		rows, err = r.db.Query(`
			SELECT e.id, e.class_id, co.name, e.student_id 
			FROM enrollments e
			JOIN classes cl ON e.class_id = cl.id
			JOIN courses co ON cl.course_id = co.id
			WHERE e.student_id = $1
		`, studentID)
	} else {
		rows, err = r.db.Query(`
			SELECT e.id, e.class_id, co.name, e.student_id 
			FROM enrollments e
			JOIN classes cl ON e.class_id = cl.id
			JOIN courses co ON cl.course_id = co.id
		`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	enrollments := []models.Enrollment{}
	for rows.Next() {
		var e models.Enrollment
		rows.Scan(&e.ID, &e.ClassID, &e.Course, &e.StudentID)
		enrollments = append(enrollments, e)
	}
	return enrollments, nil
}

func (r *Repository) CreateEnrollment(e models.Enrollment) (models.Enrollment, error) {
	err := r.db.QueryRow(
		"INSERT INTO enrollments (class_id, student_id) VALUES ($1, $2) RETURNING id",
		e.ClassID, e.StudentID,
	).Scan(&e.ID)
	return e, err
}

func (r *Repository) GetExams() ([]models.Exam, error) {
	rows, err := r.db.Query(`
		SELECT ex.id, ex.course_id, co.name, ex.title, ex.date 
		FROM exams ex
		JOIN courses co ON ex.course_id = co.id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	exams := []models.Exam{}
	for rows.Next() {
		var ex models.Exam
		var dateVal time.Time
		rows.Scan(&ex.ID, &ex.CourseID, &ex.Course, &ex.Title, &dateVal)
		ex.Date = dateVal.Format("2006-01-02")
		exams = append(exams, ex)
	}
	return exams, nil
}

func (r *Repository) CreateExam(ex models.Exam) (models.Exam, error) {
	err := r.db.QueryRow(
		"INSERT INTO exams (course_id, title, date) VALUES ($1, $2, $3) RETURNING id",
		ex.CourseID, ex.Title, ex.Date,
	).Scan(&ex.ID)
	return ex, err
}

func (r *Repository) GetMarks(studentID int) ([]models.Mark, error) {
	var rows *sql.Rows
	var err error
	if studentID > 0 {
		rows, err = r.db.Query(`
			SELECT m.id, m.exam_id, ex.title, co.name, m.student_id, m.score, m.max_score, m.grader_id, m.graded_at 
			FROM marks m
			JOIN exams ex ON m.exam_id = ex.id
			JOIN courses co ON ex.course_id = co.id
			WHERE m.student_id = $1
		`, studentID)
	} else {
		rows, err = r.db.Query(`
			SELECT m.id, m.exam_id, ex.title, co.name, m.student_id, m.score, m.max_score, m.grader_id, m.graded_at 
			FROM marks m
			JOIN exams ex ON m.exam_id = ex.id
			JOIN courses co ON ex.course_id = co.id
		`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	marks := []models.Mark{}
	for rows.Next() {
		var m models.Mark
		rows.Scan(&m.ID, &m.ExamID, &m.Exam, &m.Course, &m.StudentID, &m.Score, &m.MaxScore, &m.GraderID, &m.GradedAt)
		marks = append(marks, m)
	}
	return marks, nil
}

func (r *Repository) SaveMark(m models.Mark) (models.Mark, error) {
	m.GradedAt = time.Now()
	err := r.db.QueryRow(
		`INSERT INTO marks (exam_id, student_id, score, max_score, grader_id, graded_at) 
		 VALUES ($1, $2, $3, $4, $5, $6) 
		 ON CONFLICT (exam_id, student_id) 
		 DO UPDATE SET score = EXCLUDED.score, grader_id = EXCLUDED.grader_id, graded_at = EXCLUDED.graded_at
		 RETURNING id`,
		m.ExamID, m.StudentID, m.Score, m.MaxScore, m.GraderID, m.GradedAt,
	).Scan(&m.ID)
	return m, err
}
