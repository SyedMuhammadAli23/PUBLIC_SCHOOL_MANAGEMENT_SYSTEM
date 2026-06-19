package router

import (
	"net/http"
	"scheduling-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/timetables", h.HandleTimetables)
	mux.HandleFunc("/attendance", h.HandleAttendance)
	mux.HandleFunc("/health", h.HandleHealth)
	return mux
}
