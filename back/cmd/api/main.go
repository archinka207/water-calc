package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"water-calc/internal/handlers"
	"water-calc/internal/store"
)

func main() {
	dbConnStr := os.Getenv("DATABASE_URL")
	if dbConnStr == "" {
		dbConnStr = "postgres://postgres:postgres@localhost:5432/waterdb?sslmode=disable"
	}

	db, err := store.NewDB(dbConnStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.DB.Close()
	log.Println("Connected to PostgreSQL")

	authHandler := &handlers.AuthHandler{Store: db}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// Маршруты
	r.Post("/api/register", authHandler.Register)
	r.Post("/api/login", authHandler.Login) // Новый маршрут
	r.Post("/api/calculate", handlers.CalculateWater)

	port := ":8080"
	log.Printf("Server starting on port %s", port)
	http.ListenAndServe(port, r)
}