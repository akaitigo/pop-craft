package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

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
	if !template.IsValidCategory(category) {
		writeError(w, "invalid category: must be one of "+categoryList(), http.StatusNotFound)
		return
	}
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

// categoryList returns a comma-separated list of valid category names for
// use in error messages, derived from the template package's allowlist.
func categoryList() string {
	cats := template.Categories()
	names := make([]string, len(cats))
	for i, c := range cats {
		names[i] = string(c)
	}
	return strings.Join(names, ", ")
}
