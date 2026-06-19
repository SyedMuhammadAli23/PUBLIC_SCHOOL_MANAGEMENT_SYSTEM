package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"scheduling-service/internal/models"
	"scheduling-service/internal/repository"
	"scheduling-service/internal/service"
)

type Handler struct {
	svc *service.Service
}

func New(db *sql.DB) *Handler {
	repo := repository.New(db)
	svc := service.New(repo)
	return &Handler{svc: svc}
}

func (h *Handler) HandleTimetables(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		studentIDStr := r.URL.Query().Get("student_id")
		teacherIDStr := r.URL.Query().Get("teacher_id")
		
		studentID := 0
		teacherID := 0
		if studentIDStr != "" {
			studentID, _ = strconv.Atoi(studentIDStr)
		}
		if teacherIDStr != "" {
			teacherID, _ = strconv.Atoi(teacherIDStr)
		}

		t, err := h.svc.GetTimetables(studentID, teacherID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(t)
	} else if r.Method == http.MethodPost {
		var t models.Timetable
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newT, err := h.svc.CreateTimetable(t)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newT)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleAttendance(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		studentIDStr := r.URL.Query().Get("student_id")
		classIDStr := r.URL.Query().Get("class_id")

		studentID := 0
		classID := 0
		if studentIDStr != "" {
			studentID, _ = strconv.Atoi(studentIDStr)
		}
		if classIDStr != "" {
			classID, _ = strconv.Atoi(classIDStr)
		}

		att, err := h.svc.GetAttendance(studentID, classID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(att)
	} else if r.Method == http.MethodPost {
		var a models.Attendance
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newA, err := h.svc.SaveAttendance(a)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newA)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "UP", "service": "Scheduling Service"}`))
}
