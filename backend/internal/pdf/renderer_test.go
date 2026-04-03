package pdf_test

import (
	"testing"

	"github.com/akaitigo/pop-craft/backend/internal/model"
	"github.com/akaitigo/pop-craft/backend/internal/pdf"
)

func validRequest(paperSize model.PaperSize) model.POPRequest {
	return model.POPRequest{
		ProductName: "Test Product",
		Price:       1980,
		PriceType:   model.PriceTaxIncluded,
		Catchphrase: "Great deal",
		Description: "A test product",
		TemplateID:  "super-recommend",
		FontFamily:  model.FontGothic,
		ColorScheme: "red-gold",
		PaperSize:   paperSize,
	}
}

func TestGenerate_A4(t *testing.T) {
	data, err := pdf.Generate(validRequest(model.PaperA4))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected non-empty PDF data")
	}
	// PDF files start with %PDF
	if string(data[:4]) != "%PDF" {
		t.Errorf("expected PDF header, got %q", string(data[:4]))
	}
}

func TestGenerate_A5(t *testing.T) {
	data, err := pdf.Generate(validRequest(model.PaperA5))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected non-empty PDF data")
	}
	if string(data[:4]) != "%PDF" {
		t.Errorf("expected PDF header, got %q", string(data[:4]))
	}
}

func TestGenerate_Card(t *testing.T) {
	data, err := pdf.Generate(validRequest(model.PaperCard))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected non-empty PDF data")
	}
	if string(data[:4]) != "%PDF" {
		t.Errorf("expected PDF header, got %q", string(data[:4]))
	}
}

func TestGenerate_InvalidTemplate(t *testing.T) {
	req := validRequest(model.PaperA4)
	req.TemplateID = "nonexistent"
	_, err := pdf.Generate(req)
	if err == nil {
		t.Fatal("expected error for invalid template")
	}
}

func TestGenerate_EmptyCatchphrase(t *testing.T) {
	req := validRequest(model.PaperA4)
	req.Catchphrase = ""
	data, err := pdf.Generate(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected non-empty PDF data")
	}
}

func TestGenerate_TaxExcluded(t *testing.T) {
	req := validRequest(model.PaperA4)
	req.PriceType = "tax_excluded"
	data, err := pdf.Generate(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(data) == 0 {
		t.Fatal("expected non-empty PDF data")
	}
}
