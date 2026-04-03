package model

import "errors"

type PaperSize string

const (
	PaperA4   PaperSize = "a4"
	PaperA5   PaperSize = "a5"
	PaperCard PaperSize = "card"
)

type POPRequest struct {
	ProductName string    `json:"product_name"`
	Price       int       `json:"price"`
	PriceType   string    `json:"price_type"`
	Catchphrase string    `json:"catchphrase"`
	Description string    `json:"description,omitempty"`
	TemplateID  string    `json:"template_id"`
	FontFamily  string    `json:"font_family"`
	ColorScheme string    `json:"color_scheme"`
	PaperSize   PaperSize `json:"paper_size"`
}

func (r POPRequest) Validate() error {
	if r.ProductName == "" {
		return errors.New("product_name is required")
	}
	if r.Price < 0 {
		return errors.New("price must be non-negative")
	}
	if r.TemplateID == "" {
		return errors.New("template_id is required")
	}
	switch r.PaperSize {
	case PaperA4, PaperA5, PaperCard:
		// valid
	default:
		return errors.New("paper_size must be a4, a5, or card")
	}
	return nil
}

type POPPreview struct {
	ProductName string    `json:"product_name"`
	Price       int       `json:"price"`
	Catchphrase string    `json:"catchphrase"`
	TemplateID  string    `json:"template_id"`
	FontFamily  string    `json:"font_family"`
	ColorScheme string    `json:"color_scheme"`
	PaperSize   PaperSize `json:"paper_size"`
}

// PaperDimensions returns width and height in mm.
func PaperDimensions(size PaperSize) (float64, float64) {
	switch size {
	case PaperA4:
		return 210, 297
	case PaperA5:
		return 148, 210
	case PaperCard:
		return 91, 55
	default:
		return 210, 297
	}
}
