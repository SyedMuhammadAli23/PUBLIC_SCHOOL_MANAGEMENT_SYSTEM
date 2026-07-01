package router

import (
	"net/http"
	"academic-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/academics/courses", h.HandleCourses)
	mux.HandleFunc("/api/academics/classes", h.HandleClasses)
	mux.HandleFunc("/api/academics/enrollments", h.HandleEnrollments)
	mux.HandleFunc("/api/academics/exams", h.HandleExams)
	mux.HandleFunc("/api/academics/marks", h.HandleMarks)
	mux.HandleFunc("/api/academics/health", h.HandleHealth)
	return mux
}
