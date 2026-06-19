package router

import (
	"net/http"
	"academic-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/courses", h.HandleCourses)
	mux.HandleFunc("/classes", h.HandleClasses)
	mux.HandleFunc("/enrollments", h.HandleEnrollments)
	mux.HandleFunc("/exams", h.HandleExams)
	mux.HandleFunc("/marks", h.HandleMarks)
	mux.HandleFunc("/health", h.HandleHealth)
	return mux
}
