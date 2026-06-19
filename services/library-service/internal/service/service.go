package service

import (
	"library-service/internal/models"
	"library-service/internal/repository"
)

type Service struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetBooks() ([]models.Book, error) {
	return s.repo.GetBooks()
}

func (s *Service) CreateBook(b models.Book) (models.Book, error) {
	return s.repo.CreateBook(b)
}

func (s *Service) CheckoutBook(userID, bookID int) (models.Borrow, error) {
	return s.repo.CheckoutBook(userID, bookID)
}

func (s *Service) ReturnBook(borrowID int) (map[string]interface{}, error) {
	return s.repo.ReturnBook(borrowID)
}

func (s *Service) GetBorrows(userID int) ([]models.Borrow, error) {
	return s.repo.GetBorrows(userID)
}
