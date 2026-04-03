-- POP-Craft initial schema

CREATE TABLE IF NOT EXISTS templates (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL CHECK (category IN ('supermarket', 'drugstore', 'bookstore')),
    pattern     TEXT NOT NULL CHECK (pattern IN ('recommendation', 'limited', 'staff_pick', 'new_arrival', 'sale')),
    description TEXT NOT NULL DEFAULT '',
    primary_color TEXT NOT NULL DEFAULT '#000000',
    accent_color  TEXT NOT NULL DEFAULT '#FFFFFF',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pop_history (
    id           SERIAL PRIMARY KEY,
    template_id  TEXT NOT NULL REFERENCES templates(id),
    product_name TEXT NOT NULL,
    price        INTEGER NOT NULL CHECK (price >= 0),
    price_type   TEXT NOT NULL DEFAULT 'tax_included' CHECK (price_type IN ('tax_included', 'tax_excluded')),
    catchphrase  TEXT NOT NULL DEFAULT '',
    description  TEXT NOT NULL DEFAULT '',
    font_family  TEXT NOT NULL DEFAULT 'gothic',
    color_scheme TEXT NOT NULL DEFAULT '',
    paper_size   TEXT NOT NULL DEFAULT 'a4' CHECK (paper_size IN ('a4', 'a5', 'card')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_pop_history_template_id ON pop_history(template_id);
CREATE INDEX idx_pop_history_created_at ON pop_history(created_at DESC);
