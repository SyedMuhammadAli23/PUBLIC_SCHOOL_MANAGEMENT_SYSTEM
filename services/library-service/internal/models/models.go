package models

type Book struct {
	ID              int    `json:"id"`
	Title           string `json:"title"`
	Author          string `json:"author"`
	ISBN            string `json:"isbn"`
	Category        string `json:"category"`
	TotalCopies     int    `json:"total_copies"`
	AvailableCopies int    `json:"available_copies"`
}

type Borrow struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	BookID     int       `json:"book_id"`
	BookTitle  string    `json:"book_title,omitempty"`
	BorrowDate string    `json:"borrow_date"`
	DueDate    string    `json:"due_date"`
	ReturnDate *string   `json:"return_date"`
	FineAmount float64   `json:"fine_amount"`
}
