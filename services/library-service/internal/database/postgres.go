package database

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
)

func Connect(dbURL string) (*sql.DB, error) {
	var db *sql.DB
	var err error
	for i := 0; i < 5; i++ {
		db, err = sql.Open("postgres", dbURL)
		if err == nil {
			err = db.Ping()
			if err == nil {
				db.SetMaxOpenConns(25)
				db.SetMaxIdleConns(25)
				db.SetConnMaxLifetime(5 * time.Minute)
				return db, nil
			}
		}
		log.Printf("Failed to connect to db. Retry %d/5. Error: %v", i+1, err)
		time.Sleep(2 * time.Second)
	}
	return nil, err
}
