package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM books").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding library books...")
	_, err := db.Exec(`
		INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES
		('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'Computer Science', 5, 4),
		('Quantum Physics', 'David J. Griffiths', '978-1107189638', 'Physics', 3, 2),
		('Molecular Biology of the Cell', 'Bruce Alberts', '978-0815344322', 'Biotech', 4, 4),
		('Artificial Intelligence: A Modern Approach', 'Stuart Russell', '978-0136083207', 'Computer Science', 6, 6);
	`)
	if err != nil {
		log.Println("Error seeding books:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO borrows (user_id, book_id, borrow_date, due_date, fine_amount) VALUES
		(3, 1, '2026-06-10', '2026-06-24', 0.00),
		(3, 2, '2026-06-01', '2026-06-15', 5.50);
	`)
	if err != nil {
		log.Println("Error seeding borrows:", err)
	}
}
