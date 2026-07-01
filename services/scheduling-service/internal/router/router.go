package router

import (
	"net/http"

	"scheduling-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoints
	mux.HandleFunc("/health", h.HandleHealth)
	mux.HandleFunc("/api/schedule/health", h.HandleHealth)

	// API endpoints
	mux.HandleFunc("/api/schedule/timetables", h.HandleTimetables)
	mux.HandleFunc("/api/schedule/attendance", h.HandleAttendance)

	return mux
}