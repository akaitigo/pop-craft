package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/akaitigo/pop-craft/backend/internal/template"
	"github.com/go-chi/chi/v5"
)

func ListTemplates(w http.ResponseWriter, r *http.Request) {
	templates := template.All()
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(templates); err != nil {
		log.Printf("failed to encode templates response: %v", err)
	}
}

func GetTemplatesByCategory(w http.ResponseWriter, r *http.Request) {
	category := chi.URLParam(r, "category")
	templates := template.ByCategory(category)
	if len(templates) == 0 {
		writeError(w, "category not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(templates); err != nil {
		log.Printf("failed to encode templates response: %v", err)
	}
}
