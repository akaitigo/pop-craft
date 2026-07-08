package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/akaitigo/pop-craft/backend/internal/model"
	"github.com/akaitigo/pop-craft/backend/internal/pdf"
)

type errorResponse struct {
	Error string `json:"error"`
}

func writeError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(errorResponse{Error: msg}); err != nil {
		log.Printf("failed to write error response: %v", err)
	}
}

func PreviewPOP(w http.ResponseWriter, r *http.Request) {
	var req model.POPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := req.Validate(); err != nil {
		writeError(w, err.Error(), http.StatusBadRequest)
		return
	}

	preview := model.POPPreview{
		ProductName: req.ProductName,
		Price:       req.Price,
		PriceType:   req.EffectivePriceType(),
		Catchphrase: req.Catchphrase,
		Description: req.Description,
		TemplateID:  req.TemplateID,
		FontFamily:  req.FontFamily,
		ColorScheme: req.ColorScheme,
		PaperSize:   req.PaperSize,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(preview); err != nil {
		log.Printf("failed to encode preview response: %v", err)
	}
}

func GeneratePDF(w http.ResponseWriter, r *http.Request) {
	var req model.POPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := req.Validate(); err != nil {
		writeError(w, err.Error(), http.StatusBadRequest)
		return
	}

	data, err := pdf.Generate(req)
	if err != nil {
		log.Printf("pdf generation error: %v", err)
		writeError(w, "pdf generation failed", http.StatusInternalServerError)
		return
	}

	filename := fmt.Sprintf("pop-%s-%d.pdf", safeFilenamePart(req.TemplateID), time.Now().Unix())
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filename))
	if _, err := w.Write(data); err != nil {
		log.Printf("failed to write pdf response: %v", err)
	}
}

// safeFilenamePart strips any character that is not an ASCII letter, digit,
// hyphen or underscore so user-supplied values (e.g. the template ID) cannot
// inject characters into the Content-Disposition header or the file name.
// It falls back to "pop" when nothing usable remains.
func safeFilenamePart(s string) string {
	var b strings.Builder
	for _, r := range s {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9', r == '-', r == '_':
			b.WriteRune(r)
		}
	}
	if b.Len() == 0 {
		return "pop"
	}
	return b.String()
}
