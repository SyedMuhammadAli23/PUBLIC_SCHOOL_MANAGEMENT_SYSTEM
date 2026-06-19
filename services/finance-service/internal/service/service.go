package service

import (
	"finance-service/internal/models"
	"finance-service/internal/repository"
)

type Service struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetFeeStructures() ([]models.FeeStructure, error) {
	return s.repo.GetFeeStructures()
}

func (s *Service) CreateFeeStructure(f models.FeeStructure) (models.FeeStructure, error) {
	return s.repo.CreateFeeStructure(f)
}

func (s *Service) GetInvoices(userID int) ([]models.Invoice, error) {
	return s.repo.GetInvoices(userID)
}

func (s *Service) CreateInvoice(inv models.Invoice) (models.Invoice, error) {
	return s.repo.CreateInvoice(inv)
}

func (s *Service) PayInvoice(invoiceID int) (map[string]interface{}, error) {
	return s.repo.PayInvoice(invoiceID)
}

func (s *Service) GetPayroll(employeeID int) ([]models.Payroll, error) {
	return s.repo.GetPayroll(employeeID)
}

func (s *Service) CreatePayroll(p models.Payroll) (models.Payroll, error) {
	return s.repo.CreatePayroll(p)
}
