package handler_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/akaitigo/pop-craft/backend/internal/handler"
	"github.com/akaitigo/pop-craft/backend/internal/template"
	"github.com/go-chi/chi/v5"
)

func TestListTemplates(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/v1/templates", nil)
	w := httptest.NewRecorder()

	handler.ListTemplates(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	ct := resp.Header.Get("Content-Type")
	if ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", ct)
	}

	var templates []template.Template
	if err := json.NewDecoder(resp.Body).Decode(&templates); err != nil {
		t.Fatalf("failed to decode: %v", err)
	}

	if len(templates) != 15 {
		t.Errorf("expected 15 templates, got %d", len(templates))
	}
}

func TestGetTemplatesByCategory(t *testing.T) {
	tests := []struct {
		category string
		wantLen  int
		wantCode int
	}{
		{"supermarket", 5, http.StatusOK},
		{"drugstore", 5, http.StatusOK},
		{"bookstore", 5, http.StatusOK},
		{"unknown", 0, http.StatusNotFound},
	}

	for _, tt := range tests {
		t.Run(tt.category, func(t *testing.T) {
			r := chi.NewRouter()
			r.Get("/api/v1/templates/{category}", handler.GetTemplatesByCategory)

			req := httptest.NewRequest(http.MethodGet, "/api/v1/templates/"+tt.category, nil)
			w := httptest.NewRecorder()

			r.ServeHTTP(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != tt.wantCode {
				t.Errorf("expected status %d, got %d", tt.wantCode, resp.StatusCode)
			}

			if tt.wantCode == http.StatusOK {
				var templates []template.Template
				if err := json.NewDecoder(resp.Body).Decode(&templates); err != nil {
					t.Fatalf("failed to decode: %v", err)
				}
				if len(templates) != tt.wantLen {
					t.Errorf("expected %d templates, got %d", tt.wantLen, len(templates))
				}
			}
		})
	}
}

func TestGetTemplatesByCategory_InvalidRejectedByAllowlist(t *testing.T) {
	// Categories not in the allowlist are rejected explicitly with a
	// helpful message that enumerates the valid categories.
	for _, category := range []string{"unknown", "Supermarket", "'; DROP TABLE templates; --"} {
		t.Run(category, func(t *testing.T) {
			r := chi.NewRouter()
			r.Get("/api/v1/templates/{category}", handler.GetTemplatesByCategory)

			req := httptest.NewRequest(http.MethodGet, "/api/v1/templates/"+url.PathEscape(category), nil)
			w := httptest.NewRecorder()

			r.ServeHTTP(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusNotFound {
				t.Fatalf("expected status 404, got %d", resp.StatusCode)
			}

			var body struct {
				Error string `json:"error"`
			}
			if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
				t.Fatalf("failed to decode error body: %v", err)
			}
			for _, want := range []string{"supermarket", "drugstore", "bookstore"} {
				if !strings.Contains(body.Error, want) {
					t.Errorf("expected error message to list %q, got %q", want, body.Error)
				}
			}
		})
	}
}
