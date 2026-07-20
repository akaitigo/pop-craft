package handler_test

import (
	"encoding/json"
	"io"
	"testing"
)

func closeResponseBody(t *testing.T, body io.Closer) {
	t.Helper()
	t.Cleanup(func() {
		if err := body.Close(); err != nil {
			t.Errorf("failed to close response body: %v", err)
		}
	})
}

func mustMarshalJSON(t *testing.T, value any) []byte {
	t.Helper()
	b, err := json.Marshal(value)
	if err != nil {
		t.Fatalf("failed to marshal request body: %v", err)
	}
	return b
}
