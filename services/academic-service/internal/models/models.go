package models

import "time"

type Course struct {
	ID          int    `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Credits     int    `json:"credits"`
}

type Class struct {
	ID        int    `json:"id"`
	CourseID  int    `json:"course_id"`
	Course    string `json:"course_name,omitempty"`
	TeacherID int    `json:"teacher_id"`
	Room      string `json:"room"`
}

type Enrollment struct {
	ID        int    `json:"id"`
	ClassID   int    `json:"class_id"`
	Course    string `json:"course_name,omitempty"`
	StudentID int    `json:"student_id"`
}

type Exam struct {
	ID       int    `json:"id"`
	CourseID int    `json:"course_id"`
	Course   string `json:"course_name,omitempty"`
	Title    string `json:"title"`
	Date     string `json:"date"`
}

type Mark struct {
	ID        int       `json:"id"`
	ExamID    int       `json:"exam_id"`
	Exam      string    `json:"exam_title,omitempty"`
	Course    string    `json:"course_name,omitempty"`
	StudentID int       `json:"student_id"`
	Score     float64   `json:"score"`
	MaxScore  float64   `json:"max_score"`
	GraderID  int       `json:"grader_id"`
	GradedAt  time.Time `json:"graded_at"`
}
