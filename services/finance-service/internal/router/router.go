package router

import (
	"net/http"

	"finance-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoints
	mux.HandleFunc("/health", h.HandleHealth)
	mux.HandleFunc("/api/finance/health", h.HandleHealth)

	// API endpoints
	mux.HandleFunc("/api/finance/fee-structures", h.HandleFeeStructures)
	mux.HandleFunc("/api/finance/invoices", h.HandleInvoices)
	mux.HandleFunc("/api/finance/invoices/pay", h.HandlePayInvoice)
	mux.HandleFunc("/api/finance/payroll", h.HandlePayroll)

	return mux
}