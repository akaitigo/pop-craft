package handler

import (
	"encoding/json"
	"net/http"

	"github.com/akaitigo/pop-craft/backend/internal/model"
	"github.com/akaitigo/pop-craft/backend/internal/pdf"
)

func PreviewPOP(w http.ResponseWriter, r *http.Request) {
	var req model.POPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := req.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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
		http.Error(w, "encode error", http.StatusInternalServerError)
	}
}

func GeneratePDF(w http.ResponseWriter, r *http.Request) {
	var req model.POPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := req.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	data, err := pdf.Generate(req)
	if err != nil {
		http.Error(w, "pdf generation failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", "attachment; filename=pop.pdf")
	if _, err := w.Write(data); err != nil {
		http.Error(w, "write error", http.StatusInternalServerError)
	}
}
