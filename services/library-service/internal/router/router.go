package router

import (
	"net/http"
	"library-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/books", h.HandleBooks)
	mux.HandleFunc("/borrow", h.HandleBorrow)
	mux.HandleFunc("/return", h.HandleReturn)
	mux.HandleFunc("/borrows", h.HandleBorrows)
	mux.HandleFunc("/health", h.HandleHealth)
	return mux
}
