package models

type Timetable struct {
	ID        int    `json:"id"`
	ClassID   int    `json:"class_id"`
	Course    string `json:"course_name,omitempty"`
	DayOfWeek string `json:"day_of_week"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Room      string `json:"room,omitempty"`
}

type Attendance struct {
	ID         int    `json:"id"`
	ClassID    int    `json:"class_id"`
	Course     string `json:"course_name,omitempty"`
	StudentID  int    `json:"student_id"`
	Date       string `json:"date"`
	Status     string `json:"status"` // 'present', 'absent', 'late'
	RecordedBy int    `json:"recorded_by"`
}
