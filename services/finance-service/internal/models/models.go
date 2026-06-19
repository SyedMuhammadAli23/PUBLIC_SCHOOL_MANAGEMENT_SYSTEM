package models

import "time"

type FeeStructure struct {
	ID        int     `json:"id"`
	ClassName string  `json:"class_name"`
	Amount    float64 `json:"amount"`
	Frequency string  `json:"frequency"`
}

type Invoice struct {
	ID        int        `json:"id"`
	UserID    int        `json:"user_id"`
	Title     string     `json:"title"`
	Amount    float64    `json:"amount"`
	DueDate   string     `json:"due_date"`
	Status    string     `json:"status"` // 'unpaid', 'paid'
	PaidAt    *time.Time `json:"paid_at"`
}

type Payroll struct {
	ID         int     `json:"id"`
	EmployeeID int     `json:"employee_id"`
	Role       string  `json:"role"`
	Salary     float64 `json:"salary"`
	PayDate    string  `json:"pay_date"`
	Status     string  `json:"status"` // 'pending', 'processed'
}
