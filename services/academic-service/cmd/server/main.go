package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"academic-service/internal/config"
	"academic-service/internal/database"
	"academic-service/internal/handler"
	"academic-service/internal/middleware"
	"academic-service/internal/router"
	"academic-service/internal/seed"
)

func main() {
	cfg := config.Load()

	// Connect to Database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Connected to database successfully.")

	// Auto-migrations
	database.InitSchema(db)

	// Seed Mock Data
	seed.Seed(db)

	// Build handler
	h := handler.New(db)

	// Setup Router
	r := router.Setup(h)

	// Build main handler chain
	handlerChain := middleware.Recovery(middleware.Logging(middleware.CORS(middleware.Auth(r))))

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: handlerChain,
	}

	// Graceful Shutdown
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan

		log.Println("Shutting down server...")

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Fatalf("Server forced to shutdown: %v", err)
		}
	}()

	log.Printf("Server listening on port %s", cfg.Port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("Server failed to listen: %v", err)
	}
	log.Println("Server gracefully stopped.")
}
