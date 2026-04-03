import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategorySelector } from "./CategorySelector";

describe("CategorySelector", () => {
  it("renders all three categories", () => {
    render(<CategorySelector selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText("スーパー")).toBeInTheDocument();
    expect(screen.getByText("ドラッグストア")).toBeInTheDocument();
    expect(screen.getByText("書店")).toBeInTheDocument();
  });

  it("calls onSelect when a category is clicked", () => {
    const onSelect = vi.fn();
    render(<CategorySelector selected={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("スーパー"));
    expect(onSelect).toHaveBeenCalledWith("supermarket");
  });

  it("highlights the selected category", () => {
    render(<CategorySelector selected="drugstore" onSelect={vi.fn()} />);
    const button = screen.getByText("ドラッグストア").closest("button");
    expect(button?.className).toContain("border-blue-500");
  });

  it("does not highlight unselected categories", () => {
    render(<CategorySelector selected="supermarket" onSelect={vi.fn()} />);
    const button = screen.getByText("書店").closest("button");
    expect(button?.className).not.toContain("border-blue-500");
  });
});
