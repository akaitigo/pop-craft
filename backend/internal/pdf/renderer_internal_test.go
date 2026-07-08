package pdf

import (
	"bytes"
	"log"
	"os"
	"strings"
	"testing"
)

func TestHexToRGB_Valid(t *testing.T) {
	tests := []struct {
		hex     string
		r, g, b int
	}{
		{"#FFFFFF", 255, 255, 255},
		{"#000000", 0, 0, 0},
		{"#E53935", 229, 57, 53},
		{"#1E88E5", 30, 136, 229},
	}
	for _, tt := range tests {
		t.Run(tt.hex, func(t *testing.T) {
			r, g, b := hexToRGB(tt.hex)
			if r != tt.r || g != tt.g || b != tt.b {
				t.Errorf("hexToRGB(%q) = (%d, %d, %d), want (%d, %d, %d)", tt.hex, r, g, b, tt.r, tt.g, tt.b)
			}
		})
	}
}

// captureLog redirects the standard logger to a buffer for the duration of fn
// and returns whatever was written.
func captureLog(t *testing.T, fn func()) string {
	t.Helper()
	var buf bytes.Buffer
	log.SetOutput(&buf)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })
	fn()
	return buf.String()
}

func TestHexToRGB_InvalidFormatLogsWarning(t *testing.T) {
	// Wrong length / missing '#' takes the format-check branch.
	for _, hex := range []string{"", "fff", "#FFF", "red", "#FFFFFFF"} {
		t.Run(hex, func(t *testing.T) {
			var r, g, b int
			out := captureLog(t, func() {
				r, g, b = hexToRGB(hex)
			})
			if r != 0 || g != 0 || b != 0 {
				t.Errorf("expected (0,0,0) fallback for %q, got (%d,%d,%d)", hex, r, g, b)
			}
			if !strings.Contains(out, "invalid hex color") {
				t.Errorf("expected warning log for %q, got %q", hex, out)
			}
		})
	}
}

func TestHexToRGB_MalformedDigitsLogsWarning(t *testing.T) {
	// Correct length and '#' prefix but non-hex digits takes the parse branch.
	var r, g, b int
	out := captureLog(t, func() {
		r, g, b = hexToRGB("#GGHHII")
	})
	if r != 0 || g != 0 || b != 0 {
		t.Errorf("expected (0,0,0) fallback, got (%d,%d,%d)", r, g, b)
	}
	if !strings.Contains(out, "failed to parse hex color") {
		t.Errorf("expected parse-failure warning, got %q", out)
	}
}

func TestHexToRGB_ValidDoesNotLog(t *testing.T) {
	out := captureLog(t, func() {
		hexToRGB("#E53935")
	})
	if out != "" {
		t.Errorf("expected no log output for valid hex, got %q", out)
	}
}
