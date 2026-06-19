package repository

import (
	"database/sql"
	"time"
	"inventory-service/internal/models"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAssets() ([]models.Asset, error) {
	rows, err := r.db.Query("SELECT id, name, category, quantity, location, status, purchase_date FROM assets ORDER BY id DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	assets := []models.Asset{}
	for rows.Next() {
		var a models.Asset
		var purDate time.Time
		rows.Scan(&a.ID, &a.Name, &a.Category, &a.Quantity, &a.Location, &a.Status, &purDate)
		a.PurchaseDate = purDate.Format("2006-01-02")
		assets = append(assets, a)
	}
	return assets, nil
}

func (r *Repository) CreateAsset(a models.Asset) (models.Asset, error) {
	if a.PurchaseDate == "" {
		a.PurchaseDate = time.Now().Format("2006-01-02")
	}
	if a.Status == "" {
		a.Status = "active"
	}
	err := r.db.QueryRow(
		"INSERT INTO assets (name, category, quantity, location, status, purchase_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		a.Name, a.Category, a.Quantity, a.Location, a.Status, a.PurchaseDate,
	).Scan(&a.ID)
	return a, err
}

func (r *Repository) UpdateAssetStatus(id int, status string) error {
	_, err := r.db.Exec("UPDATE assets SET status = $1 WHERE id = $2", status, id)
	return err
}
