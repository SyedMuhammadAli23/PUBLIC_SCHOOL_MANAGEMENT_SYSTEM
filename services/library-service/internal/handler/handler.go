package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"library-service/internal/models"
	"library-service/internal/repository"
	"library-service/internal/service"
)

type Handler struct {
	svc *service.Service
}

func New(db *sql.DB) *Handler {
	repo := repository.New(db)
	svc := service.New(repo)
	return &Handler{svc: svc}
}

func (h *Handler) HandleBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		books, err := h.svc.GetBooks()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(books)
	} else if r.Method == http.MethodPost {
		var b models.Book
		if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newB, err := h.svc.CreateBook(b)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newB)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleBorrow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", 405)
		return
	}

	var req struct {
		UserID int `json:"user_id"`
		BookID int `json:"book_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	borrow, err := h.svc.CheckoutBook(req.UserID, req.BookID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	w.WriteHeader(201)
	json.NewEncoder(w).Encode(borrow)
}

func (h *Handler) HandleReturn(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", 405)
		return
	}

	var req struct {
		BorrowID int `json:"borrow_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	res, err := h.svc.ReturnBook(req.BorrowID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(res)
}

func (h *Handler) HandleBorrows(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", 405)
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	userID := 0
	if userIDStr != "" {
		userID, _ = strconv.Atoi(userIDStr)
	}

	borrows, err := h.svc.GetBorrows(userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(borrows)
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "UP", "service": "Library Service"}`))
}
