package router

import (
	"net/http"

	"inventory-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoint
	mux.HandleFunc("/health", h.HandleHealth)

	// API endpoints
	mux.HandleFunc("/api/inventory/assets", h.HandleAssets)

	return mux
}