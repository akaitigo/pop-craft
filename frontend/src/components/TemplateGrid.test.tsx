import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TemplateGrid } from "./TemplateGrid";
import type { Template } from "@/types/pop";

const mockTemplates: Template[] = [
  {
    id: "super-recommend",
    name: "本日のおすすめ",
    category: "supermarket",
    pattern: "recommendation",
    description: "スーパーの日替わりおすすめ商品",
    primary_color: "#E53935",
    accent_color: "#FDD835",
  },
  {
    id: "super-limited",
    name: "期間限定",
    category: "supermarket",
    pattern: "limited",
    description: "期間限定セール品",
    primary_color: "#FB8C00",
    accent_color: "#FFFFFF",
  },
];

describe("TemplateGrid", () => {
  it("renders templates", () => {
    render(
      <TemplateGrid
        templates={mockTemplates}
        selectedId={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("本日のおすすめ")).toBeInTheDocument();
    expect(screen.getByText("期間限定")).toBeInTheDocument();
  });

  it("shows empty message when no templates", () => {
    render(
      <TemplateGrid templates={[]} selectedId={null} onSelect={vi.fn()} />
    );
    expect(screen.getByText("テンプレートがありません")).toBeInTheDocument();
  });

  it("calls onSelect with template when clicked", () => {
    const onSelect = vi.fn();
    render(
      <TemplateGrid
        templates={mockTemplates}
        selectedId={null}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText("本日のおすすめ"));
    expect(onSelect).toHaveBeenCalledWith(mockTemplates[0]);
  });

  it("highlights selected template", () => {
    render(
      <TemplateGrid
        templates={mockTemplates}
        selectedId="super-recommend"
        onSelect={vi.fn()}
      />
    );
    const button = screen.getByText("本日のおすすめ").closest("button");
    expect(button?.className).toContain("border-blue-500");
  });
});
