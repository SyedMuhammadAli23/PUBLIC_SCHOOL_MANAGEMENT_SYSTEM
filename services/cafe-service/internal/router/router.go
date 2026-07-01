package router

import (
	"net/http"

	"cafe-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoints
	mux.HandleFunc("/health", h.HandleHealth)              // Used by ALB health checks
	mux.HandleFunc("/api/cafe/health", h.HandleHealth)     // Used for testing via ALB

	// API endpoints
	mux.HandleFunc("/api/cafe/menu", h.HandleMenu)
	mux.HandleFunc("/api/cafe/wallet", h.HandleWallet)
	mux.HandleFunc("/api/cafe/wallet/topup", h.HandleTopup)
	mux.HandleFunc("/api/cafe/order", h.HandleOrder)
	mux.HandleFunc("/api/cafe/orders", h.HandleOrders)
	mux.HandleFunc("/api/cafe/groceries", h.HandleGroceries)

	return mux
}