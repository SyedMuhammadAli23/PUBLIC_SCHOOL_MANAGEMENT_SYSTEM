package service

import (
	"scheduling-service/internal/models"
	"scheduling-service/internal/repository"
)

type Service struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetTimetables(studentID, teacherID int) ([]models.Timetable, error) {
	return s.repo.GetTimetables(studentID, teacherID)
}

func (s *Service) CreateTimetable(t models.Timetable) (models.Timetable, error) {
	return s.repo.CreateTimetable(t)
}

func (s *Service) GetAttendance(studentID, classID int) ([]models.Attendance, error) {
	return s.repo.GetAttendance(studentID, classID)
}

func (s *Service) SaveAttendance(a models.Attendance) (models.Attendance, error) {
	return s.repo.SaveAttendance(a)
}
