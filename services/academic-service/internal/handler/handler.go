package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"academic-service/internal/models"
	"academic-service/internal/repository"
	"academic-service/internal/service"
)

type Handler struct {
	svc *service.Service
}

func New(db *sql.DB) *Handler {
	repo := repository.New(db)
	svc := service.New(repo)
	return &Handler{svc: svc}
}

func (h *Handler) HandleCourses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		courses, err := h.svc.GetCourses()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(courses)
	} else if r.Method == http.MethodPost {
		var c models.Course
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newC, err := h.svc.CreateCourse(c)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newC)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleClasses(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		classes, err := h.svc.GetClasses()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(classes)
	} else if r.Method == http.MethodPost {
		var cl models.Class
		if err := json.NewDecoder(r.Body).Decode(&cl); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newCl, err := h.svc.CreateClass(cl)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newCl)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleEnrollments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		studentIDStr := r.URL.Query().Get("student_id")
		studentID := 0
		if studentIDStr != "" {
			studentID, _ = strconv.Atoi(studentIDStr)
		}
		enrollments, err := h.svc.GetEnrollments(studentID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(enrollments)
	} else if r.Method == http.MethodPost {
		var e models.Enrollment
		if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newE, err := h.svc.CreateEnrollment(e)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newE)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleExams(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		exams, err := h.svc.GetExams()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(exams)
	} else if r.Method == http.MethodPost {
		var ex models.Exam
		if err := json.NewDecoder(r.Body).Decode(&ex); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newEx, err := h.svc.CreateExam(ex)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newEx)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleMarks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		studentIDStr := r.URL.Query().Get("student_id")
		studentID := 0
		if studentIDStr != "" {
			studentID, _ = strconv.Atoi(studentIDStr)
		}
		marks, err := h.svc.GetMarks(studentID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(marks)
	} else if r.Method == http.MethodPost {
		var m models.Mark
		if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newM, err := h.svc.SaveMark(m)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newM)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "UP", "service": "Academic Service"}`))
}
