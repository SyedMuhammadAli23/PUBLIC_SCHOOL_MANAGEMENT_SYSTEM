package router

import (
	"net/http"

	"library-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoints
	mux.HandleFunc("/health", h.HandleHealth)
	mux.HandleFunc("/api/library/health", h.HandleHealth)

	// API endpoints
	mux.HandleFunc("/api/library/books", h.HandleBooks)
	mux.HandleFunc("/api/library/borrow", h.HandleBorrow)
	mux.HandleFunc("/api/library/return", h.HandleReturn)
	mux.HandleFunc("/api/library/borrows", h.HandleBorrows)

	return mux
}