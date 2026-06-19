package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"inventory-service/internal/models"
	"inventory-service/internal/repository"
	"inventory-service/internal/service"
)

type Handler struct {
	svc *service.Service
}

func New(db *sql.DB) *Handler {
	repo := repository.New(db)
	svc := service.New(repo)
	return &Handler{svc: svc}
}

func (h *Handler) HandleAssets(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		assets, err := h.svc.GetAssets()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(assets)
	} else if r.Method == http.MethodPost {
		var a models.Asset
		if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		newA, err := h.svc.CreateAsset(a)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(201)
		json.NewEncoder(w).Encode(newA)
	} else if r.Method == http.MethodPut {
		var req struct {
			ID     int    `json:"id"`
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		err := h.svc.UpdateAssetStatus(req.ID, req.Status)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"id": req.ID, "status": req.Status, "message": "Asset status updated"})
	} else {
		http.Error(w, "Method not allowed", 405)
	}
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "UP", "service": "Inventory Service"}`))
}
