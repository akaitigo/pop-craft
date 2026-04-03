package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/akaitigo/pop-craft/backend/internal/handler"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/api/v1/health", handler.Health)
	r.Get("/api/v1/templates", handler.ListTemplates)
	r.Get("/api/v1/templates/{category}", handler.GetTemplatesByCategory)
	r.Post("/api/v1/pop/preview", handler.PreviewPOP)
	r.Post("/api/v1/pop/pdf", handler.GeneratePDF)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
