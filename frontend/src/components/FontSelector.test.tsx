import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FontSelector } from "./FontSelector";

describe("FontSelector", () => {
  it("renders all four fonts with labels", () => {
    render(<FontSelector selected="gothic" onSelect={vi.fn()} />);
    expect(screen.getByText("ゴシック")).toBeInTheDocument();
    expect(screen.getByText("明朝")).toBeInTheDocument();
    expect(screen.getByText("手書き風")).toBeInTheDocument();
    expect(screen.getByText("筆文字")).toBeInTheDocument();
    // Sample text shown for each font
    expect(screen.getAllByText("あア亜")).toHaveLength(4);
  });

  it("calls onSelect when font is clicked", () => {
    const onSelect = vi.fn();
    render(<FontSelector selected="gothic" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("明朝"));
    expect(onSelect).toHaveBeenCalledWith("mincho");
  });

  it("highlights selected font", () => {
    render(<FontSelector selected="brush" onSelect={vi.fn()} />);
    const button = screen.getByText("筆文字").closest("button");
    expect(button?.className).toContain("border-blue-500");
  });
});
