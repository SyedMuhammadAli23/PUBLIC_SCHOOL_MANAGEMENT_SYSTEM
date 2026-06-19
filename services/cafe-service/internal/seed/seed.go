package seed

import (
	"database/sql"
	"log"
)

func Seed(db *sql.DB) {
	var count int
	db.QueryRow("SELECT COUNT(*) FROM menu_items").Scan(&count)
	if count > 0 {
		return
	}

	log.Println("Seeding cafe menu & wallets...")
	_, err := db.Exec(`
		INSERT INTO menu_items (name, description, price, category, is_available) VALUES
		('Technologist Power Lunch', 'Double flame-grilled beef burger with cheddar, curly fries, and signature sauce.', 8.50, 'meal', true),
		('Caffeine Hack Triple Espresso', 'Organic dark roast robusta shot for deep compiling sessions.', 2.50, 'beverage', true),
		('Bio-Green Avocado Salad', 'Mixed supergreens, fresh avocados, walnuts, and lemon vinaigrette.', 5.99, 'meal', true),
		('Data Bytes Chocolate Chip Cookie', 'Freshly baked soft-baked cookie with chunks of premium dark chocolate.', 1.50, 'snack', true);
	`)
	if err != nil {
		log.Println("Error seeding menu:", err)
		return
	}

	_, err = db.Exec(`
		INSERT INTO cafe_wallets (user_id, balance) VALUES
		(2, 120.00),
		(3, 45.00)
		ON CONFLICT (user_id) DO NOTHING;
	`)
	if err != nil {
		log.Println("Error seeding wallets:", err)
	}

	_, err = db.Exec(`
		INSERT INTO orders (user_id, items, total_price, order_date, status) VALUES
		(3, '[{"name": "Technologist Power Lunch", "quantity": 1, "price": 8.50}]'::jsonb, 8.50, '2026-06-18', 'completed'),
		(3, '[{"name": "Caffeine Hack Triple Espresso", "quantity": 2, "price": 2.50}]'::jsonb, 5.00, '2026-06-19', 'ready');
	`)
	if err != nil {
		log.Println("Error seeding orders:", err)
	}
}
