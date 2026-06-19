package router

import (
	"net/http"
	"finance-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/fee-structures", h.HandleFeeStructures)
	mux.HandleFunc("/invoices", h.HandleInvoices)
	mux.HandleFunc("/invoices/pay", h.HandlePayInvoice)
	mux.HandleFunc("/payroll", h.HandlePayroll)
	mux.HandleFunc("/health", h.HandleHealth)
	return mux
}
