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
	// Use local vars to avoid mutating struct fields
	width, height := r.Width, r.Height
	orientation := "P"
	if width > height {
		orientation = "L"
		width, height = height, width
	}

	pdf := fpdf.NewCustom(&fpdf.InitType{
		OrientationStr: orientation,
		UnitStr:        "mm",
		SizeStr:        "",
		Size:           fpdf.SizeType{Wd: width, Ht: height},
	})

	pdf.SetAutoPageBreak(false, 0)
	pdf.AddPage()

	fontSize := func(base float64) float64 {
		return base * (width / 210.0)
	}

	// Background color from template
	bgR, bgG, bgB := hexToRGB(r.Template.PrimaryColor)
	pdf.SetFillColor(bgR, bgG, bgB)
	pdf.Rect(0, 0, width, height, "F")

	pdf.SetFont("Helvetica", "B", fontSize(24))

	// Accent bar at top
	acR, acG, acB := hexToRGB(r.Template.AccentColor)
	pdf.SetFillColor(acR, acG, acB)
	barHeight := height * 0.15
	pdf.Rect(0, 0, width, barHeight, "F")

	// Template name on accent bar — use contrasting color
	pdf.SetTextColor(bgR, bgG, bgB)
	pdf.SetFont("Helvetica", "B", fontSize(14))
	pdf.SetXY(0, barHeight*0.2)
	pdf.CellFormat(width, barHeight*0.6, r.Template.Name, "", 0, "C", false, 0, "")

	// Catchphrase
	if r.Catchphrase != "" {
		pdf.SetTextColor(255, 255, 255)
		pdf.SetFont("Helvetica", "I", fontSize(12))
		pdf.SetXY(0, barHeight+height*0.05)
		pdf.CellFormat(width, fontSize(12)*0.5, r.Catchphrase, "", 0, "C", false, 0, "")
	}

	// Product name
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Helvetica", "B", fontSize(28))
	nameY := height * 0.35
	pdf.SetXY(0, nameY)
	pdf.CellFormat(width, fontSize(28)*0.5, r.ProductName, "", 0, "C", false, 0, "")

	// Price with yen sign
	pdf.SetFont("Helvetica", "B", fontSize(36))
	pdf.SetTextColor(acR, acG, acB)
	priceY := height * 0.55
	priceStr := fmt.Sprintf("%d", r.Price)
	pdf.SetXY(0, priceY)
	pdf.CellFormat(width, fontSize(36)*0.5, priceStr, "", 0, "C", false, 0, "")

	// Tax label
	taxLabel := "(tax incl.)"
	if r.PriceType == "tax_excluded" {
		taxLabel = "(tax excl.)"
	}
	pdf.SetFont("Helvetica", "", fontSize(10))
	pdf.SetXY(0, priceY+fontSize(36)*0.5)
	pdf.CellFormat(width, fontSize(10)*0.5, taxLabel, "", 0, "C", false, 0, "")

	// Description
	if r.Description != "" {
		pdf.SetTextColor(255, 255, 255)
		pdf.SetFont("Helvetica", "", fontSize(10))
		descY := height * 0.78
		pdf.SetXY(width*0.1, descY)
		pdf.MultiCell(width*0.8, fontSize(10)*0.4, r.Description, "", "C", false)
	}

	if err := pdf.Error(); err != nil {
		return fmt.Errorf("pdf error: %w", err)
	}

	return pdf.Output(w)
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
