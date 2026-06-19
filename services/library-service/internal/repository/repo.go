package repository

import (
	"database/sql"
	"errors"
	"time"
	"library-service/internal/models"
)

type Repository struct {
	db *sql.DB
}

func New(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetBooks() ([]models.Book, error) {
	rows, err := r.db.Query("SELECT id, title, author, isbn, category, total_copies, available_copies FROM books")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	books := []models.Book{}
	for rows.Next() {
		var b models.Book
		rows.Scan(&b.ID, &b.Title, &b.Author, &b.ISBN, &b.Category, &b.TotalCopies, &b.AvailableCopies)
		books = append(books, b)
	}
	return books, nil
}

func (r *Repository) CreateBook(b models.Book) (models.Book, error) {
	b.AvailableCopies = b.TotalCopies
	err := r.db.QueryRow(
		"INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		b.Title, b.Author, b.ISBN, b.Category, b.TotalCopies, b.AvailableCopies,
	).Scan(&b.ID)
	return b, err
}

func (r *Repository) CheckoutBook(userID, bookID int) (models.Borrow, error) {
	var available int
	err := r.db.QueryRow("SELECT available_copies FROM books WHERE id = $1", bookID).Scan(&available)
	if err != nil {
		return models.Borrow{}, errors.New("book not found")
	}
	if available <= 0 {
		return models.Borrow{}, errors.New("no copies available for borrowing")
	}

	tx, err := r.db.Begin()
	if err != nil {
		return models.Borrow{}, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("UPDATE books SET available_copies = available_copies - 1 WHERE id = $1", bookID)
	if err != nil {
		return models.Borrow{}, err
	}

	borrowDate := time.Now()
	dueDate := borrowDate.AddDate(0, 0, 14)
	
	var borrowID int
	err = tx.QueryRow(
		"INSERT INTO borrows (user_id, book_id, borrow_date, due_date, fine_amount) VALUES ($1, $2, $3, $4, 0.00) RETURNING id",
		userID, bookID, borrowDate, dueDate,
	).Scan(&borrowID)
	if err != nil {
		return models.Borrow{}, err
	}

	err = tx.Commit()
	if err != nil {
		return models.Borrow{}, err
	}

	return models.Borrow{
		ID:         borrowID,
		UserID:     userID,
		BookID:     bookID,
		BorrowDate: borrowDate.Format("2006-01-02"),
		DueDate:    dueDate.Format("2006-01-02"),
		FineAmount: 0.00,
	}, nil
}

func (r *Repository) ReturnBook(borrowID int) (map[string]interface{}, error) {
	var bookID int
	var dueDateVal time.Time
	var alreadyReturned *time.Time
	err := r.db.QueryRow("SELECT book_id, due_date, return_date FROM borrows WHERE id = $1", borrowID).Scan(&bookID, &dueDateVal, &alreadyReturned)
	if err != nil {
		return nil, errors.New("borrow transaction not found")
	}
	if alreadyReturned != nil {
		return nil, errors.New("book already returned")
	}

	returnDate := time.Now()
	fine := 0.00
	if returnDate.After(dueDateVal) {
		daysLate := int(returnDate.Sub(dueDateVal).Hours() / 24)
		if daysLate > 0 {
			fine = float64(daysLate) * 0.50
		}
	}

	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	_, err = tx.Exec("UPDATE borrows SET return_date = $1, fine_amount = $2 WHERE id = $3", returnDate, fine, borrowID)
	if err != nil {
		return nil, err
	}

	_, err = tx.Exec("UPDATE books SET available_copies = available_copies + 1 WHERE id = $1", bookID)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"borrow_id":   borrowID,
		"return_date": returnDate.Format("2006-01-02"),
		"fine_amount": fine,
		"message":     "Book returned successfully",
	}, nil
}

func (r *Repository) GetBorrows(userID int) ([]models.Borrow, error) {
	var rows *sql.Rows
	var err error
	if userID > 0 {
		rows, err = r.db.Query(`
			SELECT bo.id, bo.user_id, bo.book_id, b.title, bo.borrow_date, bo.due_date, bo.return_date, bo.fine_amount 
			FROM borrows bo
			JOIN books b ON bo.book_id = b.id
			WHERE bo.user_id = $1
			ORDER BY bo.borrow_date DESC
		`, userID)
	} else {
		rows, err = r.db.Query(`
			SELECT bo.id, bo.user_id, bo.book_id, b.title, bo.borrow_date, bo.due_date, bo.return_date, bo.fine_amount 
			FROM borrows bo
			JOIN books b ON bo.book_id = b.id
			ORDER BY bo.borrow_date DESC
		`)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	borrows := []models.Borrow{}
	for rows.Next() {
		var bo models.Borrow
		var bDate, dDate time.Time
		var rDate sql.NullTime
		rows.Scan(&bo.ID, &bo.UserID, &bo.BookID, &bo.BookTitle, &bDate, &dDate, &rDate, &bo.FineAmount)
		
		bo.BorrowDate = bDate.Format("2006-01-02")
		bo.DueDate = dDate.Format("2006-01-02")
		if rDate.Valid {
			retStr := rDate.Time.Format("2006-01-02")
			bo.ReturnDate = &retStr
		}
		borrows = append(borrows, bo)
	}
	return borrows, nil
}
