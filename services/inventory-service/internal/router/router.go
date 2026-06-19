package router

import (
	"net/http"
	"inventory-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/assets", h.HandleAssets)
	mux.HandleFunc("/health", h.HandleHealth)
	return mux
}
