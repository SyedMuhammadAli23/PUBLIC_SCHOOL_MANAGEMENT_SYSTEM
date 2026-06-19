package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"finance-service/internal/models"
	"finance-service/internal/repository"
	"finance-service/internal/service"
)

type Handler struct {
	svc *service.Service
}

func New(db *sql.DB) *Handler {
	repo := repository.New(db)
	svc := service.New(repo)
	return &Handler{svc: svc}
}

func (h *Handler) HandleFeeStructures(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		fees, err := h.svc.GetFeeStructures()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(fees)
	} else if r.Method == http.MethodPost {
		var f models.FeeStructure
		if err := json.NewDecoder(r.Body).Decode(&f); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newF, err := h.svc.CreateFeeStructure(f)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newF)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleInvoices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		userIDStr := r.URL.Query().Get("user_id")
		userID := 0
		if userIDStr != "" {
			userID, _ = strconv.Atoi(userIDStr)
		}
		invoices, err := h.svc.GetInvoices(userID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(invoices)
	} else if r.Method == http.MethodPost {
		var inv models.Invoice
		if err := json.NewDecoder(r.Body).Decode(&inv); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newInv, err := h.svc.CreateInvoice(inv)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newInv)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandlePayInvoice(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", 405)
		return
	}

	var req struct {
		InvoiceID int `json:"invoice_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	res, err := h.svc.PayInvoice(req.InvoiceID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(res)
}

func (h *Handler) HandlePayroll(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		empIDStr := r.URL.Query().Get("employee_id")
		empID := 0
		if empIDStr != "" {
			empID, _ = strconv.Atoi(empIDStr)
		}
		payroll, err := h.svc.GetPayroll(empID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(payroll)
	} else if r.Method == http.MethodPost {
		var p models.Payroll
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newP, err := h.svc.CreatePayroll(p)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newP)
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "UP", "service": "Finance Service"}`))
}
