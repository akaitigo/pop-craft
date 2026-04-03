package template_test

import (
	"testing"

	"github.com/akaitigo/pop-craft/backend/internal/template"
)

func TestAll(t *testing.T) {
	all := template.All()
	if len(all) != 15 {
		t.Errorf("expected 15 templates, got %d", len(all))
	}

	// Verify 3 categories × 5 patterns = 15
	categories := map[string]int{}
	for _, tmpl := range all {
		categories[string(tmpl.Category)]++
	}

	for _, cat := range []string{"supermarket", "drugstore", "bookstore"} {
		if categories[cat] != 5 {
			t.Errorf("expected 5 templates for %s, got %d", cat, categories[cat])
		}
	}
}

func TestByCategory(t *testing.T) {
	super := template.ByCategory("supermarket")
	if len(super) != 5 {
		t.Errorf("expected 5 supermarket templates, got %d", len(super))
	}

	empty := template.ByCategory("nonexistent")
	if len(empty) != 0 {
		t.Errorf("expected 0 templates for nonexistent, got %d", len(empty))
	}
}

func TestByID(t *testing.T) {
	tmpl, ok := template.ByID("super-recommend")
	if !ok {
		t.Fatal("expected to find super-recommend template")
	}
	if tmpl.Name != "本日のおすすめ" {
		t.Errorf("expected name '本日のおすすめ', got '%s'", tmpl.Name)
	}

	_, ok = template.ByID("nonexistent")
	if ok {
		t.Error("expected not to find nonexistent template")
	}
}

func TestUniqueIDs(t *testing.T) {
	all := template.All()
	seen := map[string]bool{}
	for _, tmpl := range all {
		if seen[tmpl.ID] {
			t.Errorf("duplicate template ID: %s", tmpl.ID)
		}
		seen[tmpl.ID] = true
	}
}
