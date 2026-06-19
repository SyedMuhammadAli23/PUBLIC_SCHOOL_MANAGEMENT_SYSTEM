package service

import (
	"academic-service/internal/models"
	"academic-service/internal/repository"
)

type Service struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetCourses() ([]models.Course, error) {
	return s.repo.GetCourses()
}

func (s *Service) CreateCourse(c models.Course) (models.Course, error) {
	return s.repo.CreateCourse(c)
}

func (s *Service) GetClasses() ([]models.Class, error) {
	return s.repo.GetClasses()
}

func (s *Service) CreateClass(cl models.Class) (models.Class, error) {
	return s.repo.CreateClass(cl)
}

func (s *Service) GetEnrollments(studentID int) ([]models.Enrollment, error) {
	return s.repo.GetEnrollments(studentID)
}

func (s *Service) CreateEnrollment(e models.Enrollment) (models.Enrollment, error) {
	return s.repo.CreateEnrollment(e)
}

func (s *Service) GetExams() ([]models.Exam, error) {
	return s.repo.GetExams()
}

func (s *Service) CreateExam(ex models.Exam) (models.Exam, error) {
	return s.repo.CreateExam(ex)
}

func (s *Service) GetMarks(studentID int) ([]models.Mark, error) {
	return s.repo.GetMarks(studentID)
}

func (s *Service) SaveMark(m models.Mark) (models.Mark, error) {
	return s.repo.SaveMark(m)
}
