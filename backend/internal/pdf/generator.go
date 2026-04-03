package pdf

import (
	"bytes"
	"fmt"

	"github.com/akaitigo/pop-craft/backend/internal/model"
	"github.com/akaitigo/pop-craft/backend/internal/template"
)

// Generate creates a PDF for the given POP request.
// Returns the raw PDF bytes.
func Generate(req model.POPRequest) ([]byte, error) {
	tmpl, ok := template.ByID(req.TemplateID)
	if !ok {
		return nil, fmt.Errorf("template not found: %s", req.TemplateID)
	}

	w, h := model.PaperDimensions(req.PaperSize)

	var buf bytes.Buffer
	renderer := &Renderer{
		Width:       w,
		Height:      h,
		Template:    tmpl,
		ProductName: req.ProductName,
		Price:       req.Price,
		PriceType:   string(req.EffectivePriceType()),
		Catchphrase: req.Catchphrase,
		Description: req.Description,
		FontFamily:  string(req.FontFamily),
	}

	if err := renderer.Render(&buf); err != nil {
		return nil, fmt.Errorf("render pdf: %w", err)
	}

	return buf.Bytes(), nil
}
