package models

type Asset struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Category     string `json:"category"`
	Quantity     int    `json:"quantity"`
	Location     string `json:"location"`
	Status       string `json:"status"` // 'active', 'repair', 'deprecated'
	PurchaseDate string `json:"purchase_date"`
}
