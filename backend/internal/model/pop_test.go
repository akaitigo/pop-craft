package model_test

import (
	"testing"

	"github.com/akaitigo/pop-craft/backend/internal/model"
)

func TestPOPRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     model.POPRequest
		wantErr bool
	}{
		{
			name: "valid request",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       198,
				TemplateID:  "super-recommend",
				PaperSize:   model.PaperA4,
			},
			wantErr: false,
		},
		{
			name: "empty product name",
			req: model.POPRequest{
				ProductName: "",
				Price:       198,
				TemplateID:  "super-recommend",
				PaperSize:   model.PaperA4,
			},
			wantErr: true,
		},
		{
			name: "negative price",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       -1,
				TemplateID:  "super-recommend",
				PaperSize:   model.PaperA4,
			},
			wantErr: true,
		},
		{
			name: "empty template ID",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       198,
				TemplateID:  "",
				PaperSize:   model.PaperA4,
			},
			wantErr: true,
		},
		{
			name: "invalid paper size",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       198,
				TemplateID:  "super-recommend",
				PaperSize:   "b5",
			},
			wantErr: true,
		},
		{
			name: "A5 paper size",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       198,
				TemplateID:  "super-recommend",
				PaperSize:   model.PaperA5,
			},
			wantErr: false,
		},
		{
			name: "card paper size",
			req: model.POPRequest{
				ProductName: "りんご",
				Price:       198,
				TemplateID:  "super-recommend",
				PaperSize:   model.PaperCard,
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPaperDimensions(t *testing.T) {
	tests := []struct {
		size   model.PaperSize
		wantW  float64
		wantH  float64
	}{
		{model.PaperA4, 210, 297},
		{model.PaperA5, 148, 210},
		{model.PaperCard, 91, 55},
	}

	for _, tt := range tests {
		t.Run(string(tt.size), func(t *testing.T) {
			w, h := model.PaperDimensions(tt.size)
			if w != tt.wantW || h != tt.wantH {
				t.Errorf("PaperDimensions(%s) = (%f, %f), want (%f, %f)", tt.size, w, h, tt.wantW, tt.wantH)
			}
		})
	}
}
