package router

import (
	"net/http"

	"cafe-service/internal/handler"
)

func Setup(h *handler.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoint (for ALB)
	mux.HandleFunc("/health", h.HandleHealth)

	// API endpoints
	mux.HandleFunc("/api/cafe/menu", h.HandleMenu)
	mux.HandleFunc("/api/cafe/wallet", h.HandleWallet)
	mux.HandleFunc("/api/cafe/wallet/topup", h.HandleTopup)
	mux.HandleFunc("/api/cafe/order", h.HandleOrder)
	mux.HandleFunc("/api/cafe/orders", h.HandleOrders)
	mux.HandleFunc("/api/cafe/groceries", h.HandleGroceries)

	return mux
}