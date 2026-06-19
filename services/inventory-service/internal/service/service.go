package service

import (
	"inventory-service/internal/models"
	"inventory-service/internal/repository"
)

type Service struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAssets() ([]models.Asset, error) {
	return s.repo.GetAssets()
}

func (s *Service) CreateAsset(a models.Asset) (models.Asset, error) {
	return s.repo.CreateAsset(a)
}

func (s *Service) UpdateAssetStatus(id int, status string) error {
	return s.repo.UpdateAssetStatus(id, status)
}
