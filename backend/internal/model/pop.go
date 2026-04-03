package model

import (
	"errors"
	"fmt"
)

type PaperSize string

const (
	PaperA4   PaperSize = "a4"
	PaperA5   PaperSize = "a5"
	PaperCard PaperSize = "card"
)

type PriceType string

const (
	PriceTaxIncluded PriceType = "tax_included"
	PriceTaxExcluded PriceType = "tax_excluded"
)

type FontFamily string

const (
	FontGothic      FontFamily = "gothic"
	FontMincho      FontFamily = "mincho"
	FontHandwritten FontFamily = "handwritten"
	FontBrush       FontFamily = "brush"
)

const (
	MaxProductNameLen = 50
	MaxCatchphraseLen = 100
	MaxDescriptionLen = 200
	MaxPrice          = 9999999
)

type POPRequest struct {
	ProductName string     `json:"product_name"`
	Price       int        `json:"price"`
	PriceType   PriceType  `json:"price_type"`
	Catchphrase string     `json:"catchphrase"`
	Description string     `json:"description,omitempty"`
	TemplateID  string     `json:"template_id"`
	FontFamily  FontFamily `json:"font_family"`
	ColorScheme string     `json:"color_scheme"`
	PaperSize   PaperSize  `json:"paper_size"`
}

func (r POPRequest) Validate() error {
	if r.ProductName == "" {
		return errors.New("product_name is required")
	}
	if len([]rune(r.ProductName)) > MaxProductNameLen {
		return fmt.Errorf("product_name must be %d characters or less", MaxProductNameLen)
	}
	if r.Price < 0 {
		return errors.New("price must be non-negative")
	}
	if r.Price > MaxPrice {
		return fmt.Errorf("price must be %d or less", MaxPrice)
	}
	if r.TemplateID == "" {
		return errors.New("template_id is required")
	}
	if len([]rune(r.Catchphrase)) > MaxCatchphraseLen {
		return fmt.Errorf("catchphrase must be %d characters or less", MaxCatchphraseLen)
	}
	if len([]rune(r.Description)) > MaxDescriptionLen {
		return fmt.Errorf("description must be %d characters or less", MaxDescriptionLen)
	}

	switch r.PaperSize {
	case PaperA4, PaperA5, PaperCard:
		// valid
	default:
		return errors.New("paper_size must be a4, a5, or card")
	}

	switch r.PriceType {
	case PriceTaxIncluded, PriceTaxExcluded, "":
		// valid (empty defaults to tax_included)
	default:
		return errors.New("price_type must be tax_included or tax_excluded")
	}

	switch r.FontFamily {
	case FontGothic, FontMincho, FontHandwritten, FontBrush, "":
		// valid (empty defaults to gothic)
	default:
		return errors.New("font_family must be gothic, mincho, handwritten, or brush")
	}

	return nil
}

// EffectivePriceType returns the price type, defaulting to tax_included.
func (r POPRequest) EffectivePriceType() PriceType {
	if r.PriceType == "" {
		return PriceTaxIncluded
	}
	return r.PriceType
}

type POPPreview struct {
	ProductName string     `json:"product_name"`
	Price       int        `json:"price"`
	PriceType   PriceType  `json:"price_type"`
	Catchphrase string     `json:"catchphrase"`
	Description string     `json:"description"`
	TemplateID  string     `json:"template_id"`
	FontFamily  FontFamily `json:"font_family"`
	ColorScheme string     `json:"color_scheme"`
	PaperSize   PaperSize  `json:"paper_size"`
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
