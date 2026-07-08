package handler

import "testing"

func TestSafeFilenamePart(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{"known template id", "super-recommend", "super-recommend"},
		{"underscore kept", "draft_v2", "draft_v2"},
		{"empty falls back", "", "pop"},
		{"only unsafe falls back", "??!!/\\", "pop"},
		{"strips crlf header injection", "a\r\nSet-Cookie: evil", "aSet-Cookieevil"},
		{"strips quotes and spaces", `a b"c`, "abc"},
		{"strips path traversal", "../../etc/passwd", "etcpasswd"},
		{"keeps digits", "abc123", "abc123"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := safeFilenamePart(tt.input); got != tt.want {
				t.Errorf("safeFilenamePart(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}
