package pdf

import (
	"fmt"
	"io"

	"github.com/akaitigo/pop-craft/backend/internal/template"
	fpdf "github.com/go-pdf/fpdf"
)

// Renderer generates a POP PDF document.
type Renderer struct {
	Width       float64
	Height      float64
	Template    template.Template
	ProductName string
	Price       int
	PriceType   string
	Catchphrase string
	Description string
	FontFamily  string
}

// Render writes the PDF to the given writer.
func (r *Renderer) Render(w io.Writer) error {
	orientation := "P"
	if r.Width > r.Height {
		orientation = "L"
		r.Width, r.Height = r.Height, r.Width
	}

	pdf := fpdf.NewCustom(&fpdf.InitType{
		OrientationStr: orientation,
		UnitStr:        "mm",
		SizeStr:        "",
		Size:           fpdf.SizeType{Wd: r.Width, Ht: r.Height},
	})

	pdf.SetAutoPageBreak(false, 0)
	pdf.AddPage()

	// Background color from template
	bgR, bgG, bgB := hexToRGB(r.Template.PrimaryColor)
	pdf.SetFillColor(bgR, bgG, bgB)
	pdf.Rect(0, 0, r.Width, r.Height, "F")

	// Use built-in font (Japanese font would require embedding)
	pdf.SetFont("Helvetica", "B", r.fontSize(24))

	// Accent bar at top
	acR, acG, acB := hexToRGB(r.Template.AccentColor)
	pdf.SetFillColor(acR, acG, acB)
	barHeight := r.Height * 0.15
	pdf.Rect(0, 0, r.Width, barHeight, "F")

	// Template name (pattern label)
	pdf.SetTextColor(bgR, bgG, bgB)
	pdf.SetFont("Helvetica", "B", r.fontSize(14))
	pdf.SetXY(0, barHeight*0.2)
	pdf.CellFormat(r.Width, barHeight*0.6, r.Template.Name, "", 0, "C", false, 0, "")

	// Catchphrase
	if r.Catchphrase != "" {
		pdf.SetTextColor(255, 255, 255)
		pdf.SetFont("Helvetica", "I", r.fontSize(12))
		pdf.SetXY(0, barHeight+r.Height*0.05)
		pdf.CellFormat(r.Width, r.fontSize(12)*0.5, r.Catchphrase, "", 0, "C", false, 0, "")
	}

	// Product name
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Helvetica", "B", r.fontSize(28))
	nameY := r.Height * 0.35
	pdf.SetXY(0, nameY)
	pdf.CellFormat(r.Width, r.fontSize(28)*0.5, r.ProductName, "", 0, "C", false, 0, "")

	// Price
	pdf.SetFont("Helvetica", "B", r.fontSize(36))
	pdf.SetTextColor(acR, acG, acB)
	priceY := r.Height * 0.55
	priceLabel := "tax_included"
	if r.PriceType == "tax_excluded" {
		priceLabel = "tax_excluded"
	}
	_ = priceLabel
	priceStr := fmt.Sprintf("%d", r.Price)
	pdf.SetXY(0, priceY)
	pdf.CellFormat(r.Width, r.fontSize(36)*0.5, priceStr, "", 0, "C", false, 0, "")

	// Yen symbol
	pdf.SetFont("Helvetica", "", r.fontSize(18))
	pdf.SetXY(0, priceY+r.fontSize(36)*0.5)
	pdf.CellFormat(r.Width, r.fontSize(18)*0.5, "yen", "", 0, "C", false, 0, "")

	// Description
	if r.Description != "" {
		pdf.SetTextColor(255, 255, 255)
		pdf.SetFont("Helvetica", "", r.fontSize(10))
		descY := r.Height * 0.78
		pdf.SetXY(r.Width*0.1, descY)
		pdf.MultiCell(r.Width*0.8, r.fontSize(10)*0.4, r.Description, "", "C", false)
	}

	if err := pdf.Error(); err != nil {
		return fmt.Errorf("pdf error: %w", err)
	}

	return pdf.Output(w)
}

func (r *Renderer) fontSize(base float64) float64 {
	scale := r.Width / 210.0 // A4 width as reference
	return base * scale
}

func hexToRGB(hex string) (int, int, int) {
	if len(hex) == 7 && hex[0] == '#' {
		var r, g, b int
		_, err := fmt.Sscanf(hex, "#%02x%02x%02x", &r, &g, &b)
		if err != nil {
			return 0, 0, 0
		}
		return r, g, b
	}
	return 0, 0, 0
}
