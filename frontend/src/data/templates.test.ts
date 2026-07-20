import { describe, expect, it } from "vitest";
import { getTemplatesByCategory, listTemplates } from "./templates";

describe("templates", () => {
  it("returns all 15 templates with unique IDs", () => {
    const templates = listTemplates();

    expect(templates).toHaveLength(15);
    expect(new Set(templates.map((template) => template.id)).size).toBe(15);
  });

  it.each(["supermarket", "drugstore", "bookstore"])(
    "returns five templates for %s",
    (category) => {
      expect(getTemplatesByCategory(category)).toHaveLength(5);
    }
  );

  it("returns an empty array for an unknown category", () => {
    expect(getTemplatesByCategory("unknown")).toEqual([]);
  });

  it("returns copies so callers cannot mutate the source data", () => {
    const firstRead = listTemplates();
    firstRead[0].name = "変更済み";

    expect(listTemplates()[0].name).toBe("本日のおすすめ");
  });
});
