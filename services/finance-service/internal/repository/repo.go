package repository

import (
	"database/sql"
	"time"
	"finance-service/internal/models"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetFeeStructures() ([]models.FeeStructure, error) {
	rows, err := r.db.Query("SELECT id, class_name, amount, frequency FROM fee_structures")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	fees := []models.FeeStructure{}
	for rows.Next() {
		var f models.FeeStructure
		rows.Scan(&f.ID, &f.ClassName, &f.Amount, &f.Frequency)
		fees = append(fees, f)
	}
	return fees, nil
}

func (r *Repository) CreateFeeStructure(f models.FeeStructure) (models.FeeStructure, error) {
	err := r.db.QueryRow(
		"INSERT INTO fee_structures (class_name, amount, frequency) VALUES ($1, $2, $3) RETURNING id",
		f.ClassName, f.Amount, f.Frequency,
	).Scan(&f.ID)
	return f, err
}

func (r *Repository) GetInvoices(userID int) ([]models.Invoice, error) {
	var rows *sql.Rows
	var err error
	if userID > 0 {
		rows, err = r.db.Query("SELECT id, user_id, title, amount, due_date, status, paid_at FROM invoices WHERE user_id = $1 ORDER BY due_date DESC", userID)
	} else {
		rows, err = r.db.Query("SELECT id, user_id, title, amount, due_date, status, paid_at FROM invoices ORDER BY due_date DESC")
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	invoices := []models.Invoice{}
	for rows.Next() {
		var inv models.Invoice
		var dueDateVal time.Time
		var paidAtNull sql.NullTime
		rows.Scan(&inv.ID, &inv.UserID, &inv.Title, &inv.Amount, &dueDateVal, &inv.Status, &paidAtNull)
		
		inv.DueDate = dueDateVal.Format("2006-01-02")
		if paidAtNull.Valid {
			inv.PaidAt = &paidAtNull.Time
		}
		invoices = append(invoices, inv)
	}
	return invoices, nil
}

func (r *Repository) CreateInvoice(inv models.Invoice) (models.Invoice, error) {
	inv.Status = "unpaid"
	err := r.db.QueryRow(
		"INSERT INTO invoices (user_id, title, amount, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		inv.UserID, inv.Title, inv.Amount, inv.DueDate, inv.Status,
	).Scan(&inv.ID)
	return inv, err
}

func (r *Repository) PayInvoice(invoiceID int) (map[string]interface{}, error) {
	now := time.Now()
	_, err := r.db.Exec("UPDATE invoices SET status = 'paid', paid_at = $1 WHERE id = $2 AND status = 'unpaid'", now, invoiceID)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"invoice_id": invoiceID,
		"status":     "paid",
		"paid_at":    now.Format(time.RFC3339),
		"message":    "Invoice paid successfully (simulation)",
	}, nil
}

func (r *Repository) GetPayroll(employeeID int) ([]models.Payroll, error) {
	var rows *sql.Rows
	var err error
	if employeeID > 0 {
		rows, err = r.db.Query("SELECT id, employee_id, role, salary, pay_date, status FROM payroll WHERE employee_id = $1 ORDER BY pay_date DESC", employeeID)
	} else {
		rows, err = r.db.Query("SELECT id, employee_id, role, salary, pay_date, status FROM payroll ORDER BY pay_date DESC")
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	payrollList := []models.Payroll{}
	for rows.Next() {
		var p models.Payroll
		var payDateVal time.Time
		rows.Scan(&p.ID, &p.EmployeeID, &p.Role, &p.Salary, &payDateVal, &p.Status)
		p.PayDate = payDateVal.Format("2006-01-02")
		payrollList = append(payrollList, p)
	}
	return payrollList, nil
}

func (r *Repository) CreatePayroll(p models.Payroll) (models.Payroll, error) {
	if p.Status == "" {
		p.Status = "pending"
	}
	err := r.db.QueryRow(
		"INSERT INTO payroll (employee_id, role, salary, pay_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		p.EmployeeID, p.Role, p.Salary, p.PayDate, p.Status,
	).Scan(&p.ID)
	return p, err
}
