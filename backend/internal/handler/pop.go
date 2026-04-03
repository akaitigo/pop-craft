package handler

import (
	"encoding/json"
	"log"
	"net/http"

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
		Catchphrase: req.Catchphrase,
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

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=pop.pdf")
	if _, err := w.Write(data); err != nil {
		log.Printf("failed to write pdf response: %v", err)
	}
}
