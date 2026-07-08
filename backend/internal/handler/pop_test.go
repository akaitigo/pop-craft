package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/akaitigo/pop-craft/backend/internal/handler"
)

func TestPreviewPOP_Valid(t *testing.T) {
	body := map[string]interface{}{
		"product_name": "りんご",
		"price":        198,
		"price_type":   "tax_included",
		"catchphrase":  "今が旬",
		"template_id":  "super-recommend",
		"font_family":  "gothic",
		"color_scheme": "red-gold",
		"paper_size":   "a4",
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/preview", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.PreviewPOP(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestPreviewPOP_InvalidBody(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/preview", bytes.NewReader([]byte("invalid")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.PreviewPOP(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestPreviewPOP_MissingProductName(t *testing.T) {
	body := map[string]interface{}{
		"product_name": "",
		"price":        198,
		"template_id":  "super-recommend",
		"paper_size":   "a4",
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/preview", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.PreviewPOP(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestGeneratePDF_Valid(t *testing.T) {
	body := map[string]interface{}{
		"product_name": "りんご",
		"price":        198,
		"price_type":   "tax_included",
		"catchphrase":  "今が旬",
		"template_id":  "super-recommend",
		"font_family":  "gothic",
		"color_scheme": "red-gold",
		"paper_size":   "a4",
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/pdf", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.GeneratePDF(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	ct := resp.Header.Get("Content-Type")
	if ct != "application/pdf" {
		t.Errorf("expected Content-Type application/pdf, got %s", ct)
	}

	cd := resp.Header.Get("Content-Disposition")
	if cd == "" {
		t.Error("expected Content-Disposition header")
	}
}

func TestGeneratePDF_DynamicFilename(t *testing.T) {
	body := map[string]interface{}{
		"product_name": "りんご",
		"price":        198,
		"template_id":  "super-recommend",
		"paper_size":   "a4",
	}
	b, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/pdf", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.GeneratePDF(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	cd := resp.Header.Get("Content-Disposition")
	// Expect a dynamic name of the form pop-<templateID>-<unix>.pdf, no longer
	// the static pop.pdf.
	want := regexp.MustCompile(`^attachment; filename="pop-super-recommend-\d+\.pdf"$`)
	if !want.MatchString(cd) {
		t.Errorf("Content-Disposition = %q, want match %v", cd, want)
	}
	if cd == `attachment; filename=pop.pdf` {
		t.Error("Content-Disposition is still the static pop.pdf")
	}
}

func TestGeneratePDF_InvalidBody(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/api/v1/pop/pdf", bytes.NewReader([]byte("bad")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.GeneratePDF(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}
